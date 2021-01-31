export default abstract class Shape<T> {
  constructor(public readonly data: T) {
    this.validateShapeOfData();
  }

  // eslint-disable-next-line class-methods-use-this
  validateShapeOfData(): boolean {
    throw new Error('Not implemented!');
  }
}
