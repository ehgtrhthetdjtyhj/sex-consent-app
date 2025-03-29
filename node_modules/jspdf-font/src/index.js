import fonts from '../fonts'

const initFont = (jsPDFAPI, fontFamily = 'SongtiSCBlack') => {
    if (!jsPDFAPI) {
        throw new Error('缺失jsPDF.API')
    }
    const font = fonts[fontFamily]
    var callAddFont = function() {
        this.addFileToVFS(`${fontFamily}-normal.ttf`, font);
        this.addFont(`${fontFamily}-normal.ttf`, fontFamily, 'normal');
    };
    jsPDFAPI.events.push(['addFonts', callAddFont])
    return fontFamily
}

export default initFont