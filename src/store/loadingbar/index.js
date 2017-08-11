import {
    SHOWLOADINGBAR,
    HIDELOADINGBAR,
    RESETLOADINGBAR
} from '../../constants/actionTypes';



export default function () {

    return (store) => next => (action) => {
        // const ignoreCases = new RegExp(`ANALYTICS_`, 'g');
        const ignoreCases = []; // regex or string to ignore
        const isPending = new RegExp(`_FETCHING_`, 'g');
        const isFulfilled = new RegExp(`_FETCHED_`, 'g');
        const isRejected = new RegExp(`_FETCH_.*_FAILED`, 'g');

        // if(action && _.forEach(ignoreCases, x => _.isRegExp(x) ? x.test(action.type) : x === action.type)){
        //     return next(action);
        // }
        if (action && action.type.match(isPending)) {
            store.dispatch({type: SHOWLOADINGBAR});
            setTimeout(function(){
                store.dispatch({type: HIDELOADINGBAR}); // hide it after 5 secs in case of failure
            }, 5000);
        }
        if (action && action.type.match(isFulfilled)) {
            store.dispatch({type: HIDELOADINGBAR})
        }

        if(action && action.type.match(isRejected)){
            store.dispatch({type: RESETLOADINGBAR})
        }
        if(action) {
            return next(action);
        }

    }
}
