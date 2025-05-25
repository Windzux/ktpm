type DataModel<T> = Pick<T, Exclude<keyof T, 'dtime'>>;

export function FilterData<T>(array : T[]) : DataModel<T>[]{
    const data = array.filter((el : T) => !el.hasOwnProperty("dtime"))
    return data;
}