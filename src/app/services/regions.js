import Papa from 'papaparse';

class Regions {

  constructor() {
    Papa.parse('app/services/regions.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: results => {
        const duplicates = results.data.map(item => {
          item.label = `${item.npa} ${item.commune}`;
          return item;
        });
        const duplicatesIndex = duplicates.map(item => {
          return item.label;
        });
        this.regions = duplicates.filter((item, pos) => {
          return duplicatesIndex.indexOf(item.label) === pos;
        });
      }
    });
  }

  search(txt) {
    return this.regions.filter(item => {
      return item.label.toLowerCase().indexOf(txt.toLowerCase()) >= 0;
    });
  }
}

export default Regions;

