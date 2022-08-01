import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useState, useEffect } from 'react';

function BarChartsComponent(props) {
    const [data, setData] = useState([]);
    const [company, setCompany] = useState('RENT');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [expData, setExpData] = useState([]);


    const groupByCompany = (items) => {
        setLoading(true);
        var map = new Map(),
            result;

        items.forEach(({ name, company, exp }, index) => {

            map.has(company) || map.set(company, { company, values: [] });

            map.get(company).values.push({ name, company, exp: dateFormater(exp, '-') });
        });

        result = [...map.values()];
        setData(result);
        setLoading(false);

    }

    useEffect(() => {
        const date = todayDate();
        setDate(date);
    }, []);

    useEffect(() => {
        groupByCompany(props.rawData);
    }, [props.rawData]); // eslint-disable-line react-hooks/exhaustive-deps

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

    const handleSearch = () => {

        let selectedDate = date;
        selectedDate = selectedDate.split("-");
        selectedDate = selectedDate[1] + '-' + selectedDate[2] + '-' + selectedDate[0];

        let companyData = [...data];
        companyData = companyData.find(c => c.company.replace(/\s+/g, ' ') == company);

        if (companyData?.values?.length) {
            let categories = [];
            let dataExp = [];
            companyData.values.map(c => {
                if (c.exp) {
                    let expD = c.exp.split("-");
                    c.exp = expD[1] + '-' + expD[0] + '-' + expD[2];

                    const diffTime = new Date(c.exp) - new Date(selectedDate);

                    const diff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diff < 0) {
                        categories.push(c.name);
                    }
                }
                return c;
            });

            let prod = [];
            categories.map(ele => {

                if (!prod.includes(ele)) {
                    prod.push(ele);
                    dataExp.push(countOfEle(ele, categories));
                }

            });

            setProducts(prod);
            setExpData(dataExp);
        }
        else {
            setProducts([]);
            setExpData([]);
        }

    }

    const countOfEle = (ele, arr) => {

        const updatedArr = arr.filter(oneEle => oneEle == ele);
        return updatedArr.length;

    }

    const todayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        let todayFormat = yyyy + '-' + mm + '-' + dd;
        return todayFormat;
    }

    const options = {
        chart: {
            type: 'column',
            dataLabels: {
                enabled: true
            }
        },
        title: {
            text: company
        },
        xAxis: {
            categories: products
        },
        yAxis: {
            title: {
                text: 'Expired Products'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                pointPadding: 0.35,
                groupPadding: 0.35,
                borderWidth: 1,
                shadow: true,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}'
                }
            }
        },
        series: [{
            data: expData
        }]
    }

    return (
        <>
            <div className='row mx-auto'>
                <div className='col-5'>
                    <select className='form-select form-select-sm' aria-label="23" onChange={e => setCompany(e.target.value)} value={company}>
                        {data.map((l) => <option key={l.company}>{l.company}</option>)}
                    </select>
                </div>
                <div className='col-5'>
                    <input
                        className='form-control form-control-sm'
                        type="date"
                        onChange={(e) => {
                            setDate(e.target.value);
                            // console.log(e.target.value);
                        }}
                        value={date}
                    />
                </div>
                <div className='col-2'>
                    <button type='button' className='btn btn-sm btn-info' onClick={() => handleSearch()}>search</button>
                </div>
            </div>
            <div className='row mx-auto mt-5'>
                <div className='col-12'>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </div>
            </div>
        </>
    );
}

export default BarChartsComponent;