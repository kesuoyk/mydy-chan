import './App.css';
import React from 'react';
import { DeviceList, Score } from './components';
import { useWebMidi } from './hooks';
import { NoteNumber } from './models';

function App() {
  const devices = useWebMidi(onNoteOn);
  const [highlightLines, setHighlightLines] = React.useState<NoteNumber[]>([]);

  function onNoteOn(noteNumber: NoteNumber) {
    setHighlightLines([noteNumber]);
  }

  return (
    <div className="App">
      <DeviceList devices={devices.map(d => JSON.stringify(d))}/>
      <Score highlightLines={highlightLines} />
    </div>
  );
}

export default App;
