const fs = require('fs');
const path = require('path');
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
    eleventyConfig.addShortcode("vercelAnalytics", function() {
        return `
          <script>
            window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
          </script>
          <script defer src="/_vercel/insights/script.js"></script>
        `;
    });
    
    eleventyConfig.addPassthroughCopy("src/assets");
    
    eleventyConfig.addFilter("readableDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
    });
    
    eleventyConfig.addFilter("readingTime", (text) => {
        const wordsPerMinute = 200;
        const numberOfWords = text.split(/\s/g).length;
        return Math.ceil(numberOfWords / wordsPerMinute);
    });

    eleventyConfig.addFilter("getGifs", function() {
        const gifDir = path.join(__dirname, 'src/assets/retro-badges');
        return fs.readdirSync(gifDir)
            .filter(file => file.toLowerCase().endsWith('.gif'))
            .map(file => `/assets/retro-badges/${file}`);
    });

    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/posts/*.md");
    });
    
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes"
        },
        templateFormats: ["njk", "md"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};