import selectedNoteOverlay from './selected-note-overlay.js';
import createEventEmitter from './event-emitter.js';

createEventEmitter(onEvent);

function onEvent(event) {
    console.log(event);
    if (event.type === 'string-mouse-down') {
        const newNote = addNoteOnClick(event.data.beat, event.data.stringNumber);
        const bounds = at.renderer.boundsLookup.getNoteBounds(newNote);
        selectedNoteOverlay.setSelectedNote(bounds);
        // TODO: Select created note not working
        at.render();
    }
    if (event.type === 'note-mouse-down') {
        selectedNoteOverlay.toggleNoteSelection(event.data);
    }
    if (event.type === 'numberDown' && selectedNoteOverlay.hasSelectedNote()) {
        selectedNoteOverlay.getSelectedNote().note.fret = event.data.key;
    }
    if (event.type === 'deleteDown') {
        const currentSelectedNote = selectedNoteOverlay.getSelectedNote();
        if (currentSelectedNote) {
            removeNote(currentSelectedNote.note);
            selectedNoteOverlay.setSelectedNote(null);
            selectedNoteOverlay.redrawOverlay();
            at.render();
        }
    }
    if (event.type === 'render-finished') {
        selectedNoteOverlay.redrawOverlay();
    }
    if (event.type === 'arrowRightDown' && selectedNoteOverlay.hasSelectedNote()) {
        selectedNoteOverlay.moveSelectedNoteRight();
    }
    if (event.type === 'arrowLeftDown' && selectedNoteOverlay.hasSelectedNote()) {
        selectedNoteOverlay.moveSelectedNoteLeft();
    }
}


function removeNote(note) {
    note.beat.removeNote(note);
}

function addNoteOnClick(beat, stringNumber) {
    const note = new alphaTab.model.Note();
    note.fret = 0;
    note.string = stringNumber;
    beat.addNote(note);
    beat.finish();
    return note;
}
