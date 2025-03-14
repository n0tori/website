const fs = require('fs');
const path = require('path');
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");


module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");
    
    const mdOptions = {
        html: true,
        breaks: true,
        linkify: true
    };

    const markdownLibrary = markdownIt(mdOptions);
    eleventyConfig.setLibrary("md", markdownLibrary);


    eleventyConfig.addFilter("readableDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
    });
    
    eleventyConfig.addFilter("readingTime", (text) => {
        const wordsPerMinute = 200;
        // ignore codeblocks
        const textWithoutCode = text.replace(/```[\s\S]*?```/g, '');
        const numberOfWords = textWithoutCode.split(/\s/g).length;
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