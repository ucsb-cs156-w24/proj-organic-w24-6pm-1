import React from "react";
import { useTable, useSortBy } from 'react-table'
import { Table, Button } from "react-bootstrap";
import Plaintext from "main/components/Utils/Plaintext";
// Stryker disable all
var tableStyle = {
  "background": "white",
  "display": "block" ,
  "maxWidth": "-moz-fit-content" ,
  "margin": "0 auto" ,
  "overflowX": "auto" ,
  "whiteSpace": "nowrap"
};
// Stryker restore all
export default function OurTable({ columns, data, testid = "testid", ...rest }) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    ...(rest.initialState && {
      initialState: rest.initialState
    })
  }, useSortBy)

  return (
    <Table style={tableStyle} {...getTableProps()} striped bordered hover >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                data-testid={`${testid}-header-${column.id}`}
              >
                {column.render('Header')}
                <span data-testid={`${testid}-header-${column.id}-sort-carets`}>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, _index) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

// The callback function for ButtonColumn should have the form
// (cell) => { doSomethingWith(cell); }
// The fields in cell are:
//   ["column","row","value","getCellProps","render"]
// Documented here: https://react-table.tanstack.com/docs/api/useTable#cell-properties
// Typically, you want cell.row.values, which is where you can get the individual
//   fields of the object representing the row in the table.
// Example: 
//   const deleteCallback = (cell) => 
//      toast(`Delete Callback called on id: ${cell.row.values.id} name: ${cell.row.values.name}`);

// Add it to table like this:
// const columns = [
//   {
//       Header: 'id',
//       accessor: 'id', // accessor is the "key" in the data
//   },
//   {
//       Header: 'Name',
//       accessor: 'name',
//   },
//   ButtonColumn("Edit", "primary", editCallback),
//   ButtonColumn("Delete", "danger", deleteCallback)
// ];

export function isValidHexColor(variant) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(variant);
}

export function ButtonColumn(label, variant, callback, testid) {
  const column = {
    Header: label,
    id: label,
    Cell: ({ cell }) => {
      const isHexColor = isValidHexColor(variant);
      
      const buttonProps = isHexColor 
        ? { style: { backgroundColor: variant, color: getContrastYIQ(variant) } } 
        : { variant };

      return (
        <Button
          {...buttonProps}
          onClick={() => callback(cell)}
          data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-button`}
        >
          {label}
        </Button>
      );
    }
  };
  return column;
}


export function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128.0020 ? 'black' : 'white';
}



export function HrefButtonColumn(label, variant, href, testid) {
  const column = {
    Header: label,
    id: label,
    Cell: ({ cell }) => (
      <Button
        variant={variant}
        href={`${href}`}
        data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-button`}
      >
        {label}
      </Button>
    )
  }
  return column;
}

export function PlaintextColumn(label, getText) {
  const column = {
    Header: label,
    id: label,
    Cell: ({ cell }) => (
      <Plaintext text={getText(cell)} />
    )
  }
  return column;
}

export function DateColumn(label, getDate) {
  const options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
    timeZone: 'America/Los_Angeles'
  };
  const column = {
    Header: label,
    id: label,
    Cell: ({ cell }) => {
      const date = new Date(getDate(cell));
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
      return (<>{formattedDate}</>)
    }
  }
  return column;
}