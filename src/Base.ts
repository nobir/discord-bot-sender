export default class Base {
    arraysEqual(_arr1: string[], _arr2: string[]): boolean {
        if (!Array.isArray(_arr1) || !Array.isArray(_arr2))
            return false;

        let arr1 = _arr1.concat().sort()
        let arr2 = _arr2.concat().sort()

        for (let i = 0; !(0 >= arr1.length) && i < arr1.length; i++) {
            for (let j = 0; !(0 >= arr2.length) && j < arr2.length; j++) {
                if (arr1[i] == arr2[j])
                    return true;
            }
        }

        return false;
    }
}