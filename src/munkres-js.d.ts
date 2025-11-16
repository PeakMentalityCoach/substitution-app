declare module 'munkres-js' {
  export default class Munkres {
    compute(costMatrix: number[][]): Array<[number, number]>;
  }
}
