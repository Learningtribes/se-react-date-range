import React from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types'

import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import "./component.scss"
import originalMoment from "moment";
import {extendMoment} from "moment-range";
import Icon from './calendar-alt-regular.svg'

const moment = extendMoment(originalMoment);


class Component extends React.Component {
    DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'

    constructor(props, context) {
        super(props, context);
        const {startDate='', endDate=''}=props
        this.state = {
            isOpen: false,
            activeButton:'',
            startDate,
            endDate
        };

        this.myRef = React.createRef();

        document.addEventListener("click", this.hidePanel.bind(this), true);
    }

    UNSAFE_componentWillMount() {
        const {startDate='', endDate=''}=this.props
        if (startDate != '' || endDate != ''){
            this.fireOnChange()
        }
    }

    onSelect = (value) => {
        this.setState({
            //value
            startDate: value.start.format('YYYY-MM-DD'),
            endDate: value.end.format('YYYY-MM-DD')
        }, this.fireOnChange.bind(this));
    };

    fireOnChange(){
        const {onChange}=this.props
        const {startDate, endDate}=this.state
        //const startDate = this.state.value.start.format(this.props.dateFormat || this.DEFAULT_DATE_FORMAT)
        //const endDate = this.state.value.end.format(this.props.dateFormat || this.DEFAULT_DATE_FORMAT)
        onChange && onChange(startDate,endDate)
    }

    hidePanel = e => {
        if (!this.myRef.current){
            return;
        }
        const dateRangePicker = ReactDOM.findDOMNode(this.myRef.current);
        if (dateRangePicker && dateRangePicker.contains(e.target) && this.container !== e.target) {
            return;
        }
        this.setState({isOpen: false});
    };

    onToggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    };

    setDateRange=(number, activeButton)=>{
        const today = moment();
        this.setState({
            activeButton,
            startDate:today.clone().subtract(number, "days").format(this.DEFAULT_DATE_FORMAT),
            endDate:today.clone().format(this.DEFAULT_DATE_FORMAT)
            //value: moment.range(today.clone().subtract(number, "days"), today.clone())
        }, this.fireOnChange.bind(this))
    }

    renderLabels = () => {
        const days = [7,30,90]
        return (
            <div className="labels">
                <span className="label">{this.props.label}</span>
                {days.map(number=>{
                    const {buttonBegin}=this.props, {activeButton}=this.state, classNameStr = "days-"+number
                    return (<span key={number} onClick={this.setDateRange.bind(this, number, classNameStr)}
                                  className={`day ${classNameStr}${activeButton==classNameStr?' active':''}`}
                    >{(buttonBegin || '') + number + ' days'} </span>)
                })}
            </div>
        )
    }

    renderSelectionValue = () => {
        const {useFontAwesome}=this.props
        const activeButton = ''
        const CalendarIcon = useFontAwesome ? ()=><i className="fal fa-calendar-alt calendar-icon"/> : ()=><Icon className="calendar-icon"/>;
        return (
            <div className="box-container" onClick={this.onToggle}>
                <CalendarIcon/>
                <input
                    className="start-date"
                    name={this.props.startDateName || ''}
                    onChange={e=>this.setState({startDate:e.target.value, activeButton})}
                    //.value.start.format(dateFormat || this.DEFAULT_DATE_FORMAT)
                    value={this.state.startDate}
                />
                {" - "}
                <input
                    name={this.props.endDateName || ''}
                    className="end-date"
                    onChange={e=>this.setState({endDate:e.target.value, activeButton})}
                    //value.end.format(dateFormat || this.DEFAULT_DATE_FORMAT)
                    value={this.state.endDate}
                />
            </div>
        );
    };


    render() {
        const getMixedDateValue = ()=>{
            const today = moment().clone();
            const {startDate,endDate}=this.state
            return moment.range(
                    startDate || today.subtract(7, "days"),
                    endDate || today)
        }
        return (
            <div className={'date-range-selector ' + (this.props.className || '')}>
                {this.renderLabels()}
                {this.renderSelectionValue()}
                {this.state.isOpen && (
                    <DateRangePicker className="date-range-picker"
                                     ref={this.myRef}
                                     value={getMixedDateValue()}
                                     onSelect={this.onSelect}
                                     singleDateRange={true}
                    />
                )}
            </div>
        );
    }
}

export default Component;

Component.propTypes = {
    startDate:PropTypes.string,
    endDate:PropTypes.string,
    label:PropTypes.string,
    buttonBegin:PropTypes.string,
    onChange:PropTypes.func,
}

