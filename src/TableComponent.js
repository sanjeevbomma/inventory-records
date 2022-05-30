import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

function TableComponent(props) {
  const [data, setData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(false);

  const groupByName = (items) => {
    setLoading(true);
    var map = new Map(),
      result;

    items.forEach(({ name, stock, deal, free, mrp, rate, company, batch, exp, supplier }, index) => {

      map.has(name) || map.set(name, { name, stock: stockCalc(items, name), deal: minFreeDeal(items, name, 'deal'), free: minFreeDeal(items, name, 'free'), mrp: maxRate(items, name, 'mrp'), rate: maxRate(items, name, 'rate'), company, batch: 'All', exp: newFindClosest(items, name), supplier, values: [], batchList: batchListInParent(items, name), id: index });

      map.get(name).values.push({ name, stock, deal, free, mrp, rate, company, batch, exp: dateFormater(exp, '-'), supplier, id: index });
    });

    result = [...map.values()];

    setData(result);
    setMasterData(result);
    setLoading(false);

  }

  useEffect(() => {
    groupByName(props.rawData);
  }, [props.rawData]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns = [
    {
      name: 'name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'batch',
      selector: row => row.batch,
      sortable: true,
      cell: (row, index, column, id) => {
        return (
          <select key={id + index} className='form-select form-select-sm' aria-label={index} onChange={e => handleBatch(row, index, e)} value={row.batch}>
            {row.batchList.map((l) => <option key={l + index}>{l}</option>)}
          </select>
        )
      }
    },
    {
      name: 'stock',
      selector: row => row.stock,
      sortable: true,
    },
    {
      name: 'deal',
      selector: row => row.deal,
      sortable: true,
    },
    {
      name: 'free',
      selector: row => row.free,
      sortable: true,
    },
    {
      name: 'mrp',
      selector: row => row.mrp,
      sortable: true,
    },
    {
      name: 'rate',
      selector: row => row.rate,
      sortable: true,
    },
    {
      name: 'exp',
      selector: row => row.exp,
      sortable: true,
    },
    {
      name: 'company',
      selector: row => row.company,
      sortable: true,
    },
  ];

  const batchListInParent = (items, name) => {
    const list = [...items];

    let batch = list.filter(e => e.name === name && e.batch !== undefined);

    batch = batch.map(b => b.batch);

    batch.unshift('All');

    batch = [...new Set(batch)];

    return batch;
  }

  const stockCalc = (items, name) => {
    const list = [...items];

    return list.filter(i => i.name === name).reduce((a, b) => a + b.stock, 0);

  }

  const maxRate = (items, name, type) => {
    const list = [...items];

    let rate = list.filter(e => e.name === name);

    rate = rate.map(b => b[type]);

    const largest = Math.max.apply(0, rate);

    return largest;

  }

  const minFreeDeal = (items, name, type) => {
    const list = [...items];

    let deal = list.filter(e => e.name === name);

    deal = deal.map(b => {
      b.ratio = b.free && b.deal ? b.free / b.deal : 0;
      return b;
    });


    const smallestObj = deal.reduce((p, c) => p.ratio > c.ratio ? p : c);

    return smallestObj[type];

  }


  const dateFormater = (dates, separator) => {
    const date = new Date(dates);

    date.setDate(date.getDate() + 1);  // addin one day for date because from sheet we are getting one day before date

    if (!isNaN(date)) {
      var day = date.getDate();
      // add +1 to month because getMonth() returns month from 0 to 11
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      // show date and month in two digits
      // if month is less than 10, add a 0 before it
      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }

      // now we have day, month and year
      // use the separator to join them
      return day + separator + month + separator + year;
      // return dates.toLocaleDateString("en-US");
    }
    else {
      return '';
    }
  }

  const newFindClosest = (items, name) => {
    const list = [...items];

    let dates = list.filter(e => e.name === name && !isNaN(new Date(e.exp)));

    dates = dates.map(b => b.exp);

    var testDate = new Date();

    testDate.toString();

    var before = [];
    var max = dates.length;

    for (var i = 0; i < max; i++) {
      var tar = dates[i];

      var arrDate = new Date(tar);
      // 3600 * 24 * 1000 = calculating milliseconds to days, for clarity.
      const diffTime = Math.abs(testDate - arrDate);

      const diff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diff > 0) {
        before.push({ diff: diff, index: i, date: tar });
      }
      else {
        before.push({ diff: diff, index: i, date: tar });
      }
    }

    before.sort((a, b) => {
      if (a.diff < b.diff) {
        return -1;
      }
      if (a.diff > b.diff) {
        return 1;
      }
      return 0;
    });

    const smallestDate = before.length ? before[0].date : '';

    return dateFormater(smallestDate, '-');

  }

  const handleBatch = (row, index, e) => {
    setLoading(true);

    if (e.target.value !== 'All') {
      const mstData = [...masterData];
      const childList = row.values.find(x => x.batch === e.target.value);

      let newRow = { ...row };

      newRow.batch = e.target.value;
      newRow.stock = childList.stock;
      newRow.deal = childList.deal;
      newRow.free = childList.free;
      newRow.mrp = childList.mrp;
      newRow.rate = childList.rate;
      newRow.exp = childList.exp;

      mstData[index] = newRow;

      setData(mstData);
      setLoading(false);

    }
    else {
      setData(masterData);
      setLoading(false);
    }
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        responsive={true}
        highlightOnHover={true}
        striped={true}
        title="inventory records"
        // pagination={true}
        // fixedHeader={true}
        // theme='solarized'
        keyField='id'
        progressPending={loading}
      />
    </>
  );
}

export default TableComponent;