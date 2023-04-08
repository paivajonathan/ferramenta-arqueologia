module.exports = {
    getContentType: (imageName) => {
        const fileExtension = imageName.split('.').pop().toLowerCase();
        switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            default:
                return null;
        }
    }
}