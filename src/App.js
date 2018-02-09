import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
// import logo from './logo.svg';

import './App.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mdn-like.css';

import Tappable from 'react-tappable';
import {Responsive, WidthProvider} from 'react-grid-layout';
import enhanceWithClickOutside from 'react-click-outside';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/markdown/markdown';

import {isTouchDevice} from './utils';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
import Modal from 'react-responsive-modal';

const breakpointConfig = {
    breakpoints: {lg: 1000, md: 592, sm: 360, xs: 0},
    cols: {lg: 6, md: 4, sm: 3, xs: 2}
};

const initialBreakpoint = 'lg';

@inject('store')
@observer
class NoteItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const store = this.props.store;
        const note = this.props.note;
        const isSelected = this.props.isSelected;
        return (
            <Tappable component="div"
                className={
                    `note-card ${isSelected ? "note-card-selected" : ""}
                    ${store.editingNoteID == note.id? "editing": ""}`
                }
                style={{backgroundColor: note.color}}
                pressDelay={500}
                onPress={() => {}}
                moveThreshold={10}
                onTap={() => {
                    // console.log('Go editing:', note.id);
                    store.editingNoteID = note.id;
                }}>
                <h1>{note.title}</h1>
                <div className="note-content">
                    <pre>{note.content}</pre>
                </div>
                <div className="label-list">
                    {note.labels.map(label => 
                        <span className="label-item" key={label}>{label}</span>
                    )}
                </div>
            </Tappable>
        );
    }
}

@inject('store')
@observer
class NoteEditor extends Component {
    render() {
        const note = this.props.note;
        return (
            <div className="note-editor" style={{...this.props.style, backgroundColor: note.color}}>
                <h1>
                    <input type="text" value={note.title} onChange={(e) => {
                        note.title = e.target.value;
                    }}/>
                </h1>
                <CodeMirror
                    className="content-editor"
                    value={note.content}
                    onChange={content => {
                        note.content = content;
                    }}
                    options={{
                        lineNumbers: false,
                        mode: 'markdown',
                        theme: 'mdn-like',
                        lineWrapping: true,
                        autofocus: true,
                    }} />
                <div className="label-list">
                    {note.labels.map(label => 
                        <span className="label-item" key={label}>
                            {label}
                            <span className="remove-me"
                                onClick={e => {
                                    console.log('x:', label);
                                    note.labels.remove(label);
                                }}>
                                <span className='x'>.</span>
                                <span className='x'>.</span>
                                <span className='x'>×</span>
                                <span className='x'>.</span>
                            </span>
                        </span>
                    )}
                    <span className="new-label">
                        <input type="text" placeholder="Label++"
                        onKeyUp={e => {
                            const value = e.target.value;
                            if (e.key == 'Enter') {
                                if (!value || !value.trim()) {
                                    e.target.value = null;
                                    return;
                                }
                                value.split(/[\s,]/).forEach(label => {
                                    label = label.trim();
                                    if (label && !note.labels.includes(label)) {
                                        note.labels.push(label);
                                    }
                                });
                                // Clear input:
                                e.target.value = null;
                            }
                        }} />
                    </span>
                </div>
            </div>
        );
    }
}

@inject('store')
@observer
@enhanceWithClickOutside
class NotesGrid extends Component {
    toggleSelect = (id) => {
        this.setState((prevState) => {
            const selectedNotes = prevState.selectedNotes.slice();
            const idx = selectedNotes.indexOf(id);
            if (idx >= 0) {
                selectedNotes.splice(idx, 1);
            } else {
                selectedNotes.push(id);
            }
            return {selectedNotes};
        });
    }
    clearSelected = () => this.setState({selectedNotes: []})
    handleClickOutside() {
        this.clearSelected();
    }
    constructor(props) {
        super(props);
        this.state = {
            currentBreakpoint: initialBreakpoint,
            cols: breakpointConfig.cols[initialBreakpoint],
            selectedNotes: [],
        };
    }
    render() {
        const store = this.props.store;
        return (
            <div className="notes-grid-container">
                <ResponsiveReactGridLayout
                    layouts={this.genLayouds(this.props.store.notesOrder)}
                    breakpoints={breakpointConfig.breakpoints}
                    cols={breakpointConfig.cols}
                    // compactType="horizontal"
                    isResizable={false}
                    isDraggable={!isTouchDevice() || this.state.selectedNotes.length > 0}
                    rowHeight={100}
                    // preventCollision={true}
                    onBreakpointChange={(bp, cols) => {
                        this.setState({currentBreakpoint: bp, cols: cols});
                        // console.log(`Current breakpoint: ${bp}/${cols}`);
                    }}
                    onLayoutChange={(currentLayout) => {
                        // console.log('onLayoutChange');
                        this.setState((prevState) => {
                            let cols = prevState.cols;
                            let notesOrder = currentLayout.map(item => ({
                                i: item.i,
                                pos: item.y * cols + item.x + 1
                            })).sort((a, b) => a.pos - b.pos).map(n => n.i);
                            // console.log("Notes order:", notesOrder.valueOf(), `@${prevState.currentBreakpoint}`);
                            store.notesOrder = notesOrder;
                        });
                    }}
                >
                {
                    store.notesOrder.map(id => {
                        let note = this.props.store.notes[id] || {};
                        return (
                            <div key={id}>
                                <NoteItem
                                    note={note}
                                    isSelected={this.state.selectedNotes.includes(note.id)}
                                >
                                </NoteItem>
                            </div>
                        );
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
        let layout = order.map((id, idx) => ({
            i: id,
            x: genX(idx, cols),
            y: Math.floor(idx / cols),
            // minH: 0,
            w: 1,
            h: 2,
        }));
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

@inject('store')
@observer
class App extends Component {
    render() {
        const store = this.props.store;
        const editingNote = this.props.store.notes[store.editingNoteID];
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">ZNote</h1>
                </header>
                <NotesGrid />
                {editingNote &&
                    <Modal classNames={{
                        modal: "note-editor-modal",
                        transitionEnter: 'transition-enter',
                        transitionEnterActive: 'transition-enter-active',
                        transitionExit: 'transition-exit-active',
                        transitionExitActive: 'transition-exit-active',
                    }}
                        open={editingNote? true: false}
                        showCloseIcon={false}
                        onClose={() => {
                            store.editingNoteID = null;
                        }}
                        styles={{
                            'modal': {
                                margin: 0,
                                padding: 0,
                                minHeight: 300,
                                minWidth: 600,
                                background: editingNote.color,
                            }
                        }}
                        >
                        <NoteEditor note={editingNote} />
                    </Modal>
                }
            </div>
        );
    }
}

export default App;
