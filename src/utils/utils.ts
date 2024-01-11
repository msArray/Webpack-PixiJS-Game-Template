const isMobile = () => {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
        return true;
    } else {
        return false;
    }
}

const tweURL = (twemojiCode: string) => {
    return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.3/assets/svg/${twemojiCode}.svg`
}

export {
    isMobile,
    tweURL,
}