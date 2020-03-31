export class DataService {
  getDetails() {
    const resultPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Data');
      }, 3500);
    });
    return resultPromise;
  }
}
