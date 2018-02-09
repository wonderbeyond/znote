import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

import {notes, notesOrder} from './store';

const breakpointConfig = {
    breakpoints: {lg: 1000, md: 592, sm: 360, xs: 0},
    cols: {lg: 6, md: 4, sm: 3, xs: 2}
};

const initialBreakpoint = 'lg';

class NotesGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentBreakpoint: initialBreakpoint,
            cols: breakpointConfig.cols[initialBreakpoint],
            notes: notes,
            notesOrder: notesOrder,
        };
    }
    render() {
        return (
            <div className="notes-grid-container">
                <ResponsiveReactGridLayout
                    layouts={this.genLayouds(this.state.notesOrder)}
                    breakpoints={breakpointConfig.breakpoints}
                    cols={breakpointConfig.cols}
                    compactType="horizontal"
                    onBreakpointChange={(bp, cols) => {
                        this.setState({currentBreakpoint: bp, cols: cols});
                        console.log(`Current breakpoint: ${bp}/${cols}`);
                    }}
                    onLayoutChange={(currentLayout) => {
                        // console.log('onLayoutChange');
                        this.setState((prevState) => {
                            let cols = prevState.cols;
                            let notesOrder = currentLayout.map(item => ({
                                i: item.i,
                                pos: item.y * cols + item.x + 1
                            })).sort((a, b) => a.pos - b.pos).map(n => n.i);
                            if (JSON.stringify(notesOrder) != JSON.stringify(prevState.notesOrder)) {
                                // console.log("Current layout:", JSON.stringify(currentLayout));
                                console.log("Notes order:", notesOrder, `@${prevState.currentBreakpoint}`);
                                return {notesOrder};
                            } else {
                                return {}
                            }
                        });
                    }}
                >
                {
                    this.state.notesOrder.map(id => {
                        let note = this.state.notes[id] || {};
                        let backgroundColor = note.color;
                        return <div key={id} style={{backgroundColor}}>{note.content}</div>;
                    })
                }
                </ResponsiveReactGridLayout>
            </div>
        );
    }
    genLayoud(order, cols) {
        const genX = (idx, cols) => {
            let x = (idx + 1) % cols - 1;
            if (x == -1) {
                return cols - 1;
            }
            return x;
        };
        let layout = order.map((id, idx) => ({i: id, x: genX(idx, cols), y: Math.floor(idx / cols), w: 1, h: 1}));
        return layout;
    }
    genLayouds(notesOrder) {
        return {
            lg: this.genLayoud(notesOrder, breakpointConfig.cols['lg']),
            md: this.genLayoud(notesOrder, breakpointConfig.cols['md']),
            sm: this.genLayoud(notesOrder, breakpointConfig.cols['sm']),
            xs: this.genLayoud(notesOrder, breakpointConfig.cols['xs']),
        };
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">ZNote</h1>
                </header>
                <NotesGrid />
            </div>
        );
    }
}

export default App;
