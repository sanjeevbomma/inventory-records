import './App.css';
// import file from './assets/Sample_Inventory.xlsx';
import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import TableComponent from './TableComponent';
import PieChartsComponent from './PieChartsComponent';
import BarChartsComponent from './BarChartsComponent';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    // let workbook = XLSX.readFile(file);
    // console.log(workbook) //should print an array with the excel file data
  }, []);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer', cellDates: true });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error)
      }
    });
    promise.then((d) => {
      setData(d);
    })
  }

  return (
    <div className="App">
      <div className='row mt-3 mx-auto'>
        <div className='col-12'>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              readExcel(file);
            }}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </div>
      </div>

      <div className='row mt-3 mx-auto'>
        <div className='col-12'>
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="table-tab" data-bs-toggle="tab" data-bs-target="#table" type="button" role="tab" aria-controls="table" aria-selected="true">Table</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pie-chart-tab" data-bs-toggle="tab" data-bs-target="#pie-chart" type="button" role="tab" aria-controls="pie-chart" aria-selected="false">Pie Chart</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="bar-chart-tab" data-bs-toggle="tab" data-bs-target="#bar-chart" type="button" role="tab" aria-controls="bar-chart" aria-selected="false">Bar Chart</button>
            </li>
          </ul>
          <div className="tab-content border border-top-0" id="myTabContent">
            <div className="tab-pane fade show active" id="table" role="tabpanel" aria-labelledby="table-tab">
              <TableComponent rawData={data} />
            </div>
            <div className="tab-pane fade py-3" id="pie-chart" role="tabpanel" aria-labelledby="pie-chart-tab">
              <PieChartsComponent rawData={data} />
            </div>
            <div className="tab-pane fade py-3" id="bar-chart" role="tabpanel" aria-labelledby="bar-chart-tab">
              <BarChartsComponent rawData={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
