import * as React from 'react';
import '../styles/Grid.css';
import GridRow from "./GridRow";

export default function Grid({headers, tableData, onClickHandler,
                                 clickableHeader=[]}) {
    return (
        <table>
            <tbody>
            <GridRow key={-1} id={-1} headers={headers} values={headers} isHeader={true}
                     onClickHandler={onClickHandler}/>
            {tableData.map(value => {
                const rowValues = []
                headers.forEach((item) => {
                    if (value[item]) {
                        rowValues.push(value[item])
                    } else {
                        rowValues.push("")
                    }
                })
                return <GridRow key={value["id"]} id={value["id"]} values={rowValues}
                                headers={headers}
                                onClickHandler={onClickHandler}
                                clickableHeader={clickableHeader}/>
            })}
            </tbody>
        </table>
    );
}