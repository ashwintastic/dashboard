// import langmap from "langmap";

// const langList = Object.keys(langmap).reduce((obj, key, idx) => {
//     let keyWithUnderscore = key.replace('-', '_');
//     obj[idx] = {};
//     obj[idx] = langmap[key]
//     obj[idx].shortName = keyWithUnderscore;
//     return obj;
// }, []).sort(compareFunc);




import localeFB from './localeFB.json';

const localeList = localeFB.locales.locale;

const langList = localeList.reduce((acc, obj, idx) => {
    acc[idx] = {};
    acc[idx].shortName = obj.codes.code.standard.representation;
	acc[idx].englishName =  obj.englishName;
    return acc;
}, []).sort(compareFunc);


function compareFunc(first, second) {
    if(first.englishName < second.englishName) return -1;
    if(first.englishName > second.englishName) return 1;
    if(first.englishName == second.englishName) return 0;


}


export default langList;
