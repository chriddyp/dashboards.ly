'use strict';

import React from 'react';
var DragSource = require('react-dnd').DragSource;
import AppActions from '../actions/AppActions';
import ComponentTypes from '../constants/ComponentTypes';

var InputTitle = React.createClass({
    propTypes: {
        placeholder: React.PropTypes.string,
        plot_url: React.PropTypes.string
    },
    getInitialState: function() {
        return {value: ''};
    },
    handleChange: function(event) {
        AppActions.addKeyToPlotObject({
            plot_url: this.props.plot_url,
            key: 'title',
            value: event.target.value
        });
        this.setState({value: event.target.value});
    },
    render: function() {
        return (<span>
            <input
            className="chart-title"
            placeholder={this.props.placeholder}
            type="text" value={this.state.value}
            onChange={this.handleChange}/>
        </span>)
    }
});


var DashboardPlotBlock = React.createClass({
    propTypes: {
        plot_url: React.PropTypes.string.isRequired,
        connectDragSource: React.PropTypes.func.isRequired,
        isDragging: React.PropTypes.bool.isRequired,
        canRearrange: React.PropTypes.bool.isRequired
    },

    handleRemovePlot: function(e) {
        AppActions.removePlotFromDashboard(this.props.plot_url);
    },

    render: function() {
        let connectDragSource = this.props.connectDragSource;
        let isDragging = this.props.isDragging;

        let iframeUrl = this.props.plot_url + '.embed?autosize=true&link=false&source=false';
        let imageUrl = this.props.plot_url + '.png';
        let chartStyle = {
            'border': '1px solid #e2e2e2',
            'borderRadius': '3px'
        };
        let chartClasses = 'chart-wrapper';
        let titleBlock = null;
        if(ENV.mode==='create') {
            titleBlock = <InputTitle plot_url={this.props.plot_url} placeholder="plot title (optional)"/>
        }

        if(this.props.plot_url) {
            let iframeStyle = {
                maxWidth: '100%',
                minHeight: '50vh',
                maxHeight: '80vh',
                objectFit: 'contain',
                margin: '0 auto',
                display: 'block',
                border: 'none',
                borderRadius: '3px'
            };
            let dragBar = null;
            if(this.props.canRearrange) {
                dragBar = (<div style={{height: '18px'}}>
                    <a onClick={this.handleRemovePlot} dataTip="remove plot" style={{'cursor': 'pointer', 'float': 'left', 'fontSize': '18px', 'lineHeight': '18px', 'paddingLeft': '4px', 'color': 'rgb(80, 107, 123)'}}>&times;</a>
                    <a className="grab" dataTip="move plot to a new row"><img style={{'float': 'right', 'height': '100%'}} src="http://i.imgur.com/F5biwyG.png"/></a>
                </div>)
            }
            return connectDragSource(
                <div style={chartStyle} className={chartClasses}>
                    {dragBar}
                    <iframe src={iframeUrl} style={iframeStyle}></iframe>
                </div>
            );
            /*
            return connectDragSource(
                <div style={chartStyle} className={chartClasses}>
                    {titleBlock}
                    <img style={style} src={imageUrl}/>
                </div>
            )
            */
        } else {
            return(<div style={chartStyle} className="chart-wrapper"></div>)
        }
    }
});

var DraggableBlockSpec = {
    beginDrag: function(props, monitor, component) {
        return {id: props.plot_url};
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
};

exports.DashboardPlotBlock = DragSource(ComponentTypes.DRAGGABLE_PLOT_BLOCK, DraggableBlockSpec, collect)(DashboardPlotBlock);
