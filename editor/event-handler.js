function emitEvent(event) {
    console.log(event);
    if (event.type === 'string-mouse-down') {
        const note = new alphaTab.model.Note();
        note.fret = 8;
        note.string = event.data.stringNumber;
        event.data.beat.addNote(note);
        event.data.beat.finish();
        at.render();
    }
}

function getStringNumber(y, barBounds) {
    // TODO: Add padding around first and last frets
    const fretH = barBounds.h / 6;
    if (y > barBounds.y && y < barBounds.y + fretH * 1) {
        return 6;
    } 
    if (y > barBounds.y && y < barBounds.y + fretH * 2) {
        return 5;
    } 
    if (y > barBounds.y && y < barBounds.y + fretH * 3) {
        return 4;
    }
    if (y > barBounds.y && y < barBounds.y + fretH * 4) {
        return 3;
    }
    if (y > barBounds.y && y < barBounds.y + fretH * 5) {
        return 2;
    }
    if (y > barBounds.y && y < barBounds.y + fretH * 6) {
        return 1;
    }
    return null;
}

$(window).on('alphaTab.beatMouseDown', (event, beat) => {
    const y = window.event.pageY;
    const x = window.event.offsetX;
    const note = at.renderer.boundsLookup.getNoteAtPos(beat, x, y);
    if (note) {
      emitEvent({
            type: 'note-mouse-down',
            data: {
                note
            }
      });
      return;
    }
    const barBounds = at.renderer.boundsLookup.findBeat(beat).barBounds.visualBounds;
    const stringNumber = getStringNumber(y, barBounds);
    if (stringNumber) {
        emitEvent({
            type: 'string-mouse-down',
            data: {
                stringNumber,
                beat
            }
        });
    }
});
