import { Button } from 'semantic-ui-react'
import styled from 'styled-components';

export const GreenButton = styled(Button)`
  background-color:#8bc34a!important;
  color:white!important;
  font-size:14px!important;
`

export const PurpleButton = styled(Button)`
  background-color:rgba(156, 39, 176, 0.7)!important;
  color:white!important;
  font-size:14px!important;
`

export const RedButton = styled(Button)`
  background-color:#d9534f!important;
  color:white!important;
  font-size:14px!important;
`

export const QuerTriangleIconMobile = styled.div`
  width: 0;
  height: 0;
  border-left: 10vw solid transparent;
  border-right: 10vw solid transparent;
  border-top: 5vh solid #9c27b0;
  padding: 0px!important;
`

export const QuerTriangleIconComp = styled.div`
  width: 0;
  height: 0;
  border-left: 5vw solid transparent;
  border-right: 5vw solid transparent;
  border-top: 5vh solid #9c27b0;
  padding: 0px!important;
`
export const TimeHistChartConfig = (TimeHistArray) => ({
  chart: {
      type: 'column',
      height:200
  },
  title: {
      text: 'Quer service time history'
  },
  xAxis: {
      categories: [...Array(TimeHistArray.length).keys()],
      crosshair: true
  },
  yAxis: {
      min: 0,
      title: {
          text: 'Timing [min(s)]'
      }
  },
  tooltip: {
      headerFormat: '',
      pointFormat: '<span style="font-size:10px">{point.y} min(s)</span>',
      shared: true,
      useHTML: true
  },
  plotOptions: {
      column: {
          pointPadding: 0.2,
          borderWidth: 0
      }
  },
  series: [{
    showInLegend:false,
    data: TimeHistArray
  }]
})

export const APIhost = "https://us-central1-quer-mobi.cloudfunctions.net";
