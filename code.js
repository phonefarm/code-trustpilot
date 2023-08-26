let allReviews = []; // This will store reviews from all pages
let lastpage=true;
let pages = (document.querySelector('#__next > div > div > main > div > div.styles_mainContent__nFxAv > section > div.styles_pagination__6VmQv > nav > a:nth-child(5) > span'))? parseInt( document.querySelector('#__next > div > div > main > div > div.styles_mainContent__nFxAv > section > div.styles_pagination__6VmQv > nav > a:nth-child(5) > span').innerText):3;
// Function to get reviews from the current page
function getReviewsFromCurrentPage() {
    const reviewElements = document.querySelectorAll('.typography_body-l__KUYFJ.typography_appearance-default__AAY17.typography_color-black__5LYEn');
    return Array.from(reviewElements).map(element => element.innerText);
}

// Function to save the reviews to a downloadable .txt file
function saveReviewsToFile(reviews) {
    const blob = new Blob([reviews.join('\n\n')], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'all_reviews.txt';
    
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Function to click the "Next" button
function clickNextPage() {
    const nextPageButton = document.querySelector('#__next > div > div > main > div > div.styles_mainContent__nFxAv > section > div.styles_pagination__6VmQv > nav > a.link_internal__7XN06.button_button__T34Lr.button_m__lq0nA.button_appearance-outline__vYcdF.button_squared__21GoE.link_button___108l.pagination-link_next__SDNU4.pagination-link_rel__VElFy');
    if (nextPageButton) {
        nextPageButton.click();
    } else {
        console.log('Next page button not found. Perhaps you are on the last page.');
        lastpage=false;
    }
}

// Main scraping loop with delay
async function scrapeLoop(times) {
    for (let i = 1; i <= times; i++) {
        const reviews = getReviewsFromCurrentPage();
        allReviews.push(...reviews);

        // If not the last iteration, click to the next page and wait for a bit
        if (i < times && lastpage) {
            clickNextPage();
            await new Promise(resolve => {
                const randomDelay = Math.random() * 1000 + 2000;  // delay between 2-3 seconds
                setTimeout(resolve, randomDelay);
            });
        }
    }
    
    // After scraping all pages, save all reviews to one file
    saveReviewsToFile(allReviews);
    console.log('Scraping completed!');
}

// Start the scraping loop for 50 times
console.log("Scan "+pages+" pages");
scrapeLoop(pages);
