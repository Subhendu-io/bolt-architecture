import { Injectable } from '@angular/core';
import * as json2csv from 'json2csv';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  Json2csvParser = json2csv.Parser;

  constructor() {}

  downloadAsCSV(data: any, filename: string) {
    const csvData = this.convertToCSV(data);
    const file = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(file, filename);
  }
  convertToCSV(objArray: any, fields?) {
    const json2csvParser = new this.Json2csvParser({ opts: fields });
    const csv = json2csvParser.parse(objArray);
    return csv;
  }

  downloadAsExcel(data: any, fileName: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }
  saveAsExcelFile(buffer: any, fileName: string) {
     const data: Blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
     saveAs(data, fileName);
  }
}
