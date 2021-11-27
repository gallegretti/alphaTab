class SelectedNoteOverlay {
    currentSelectedNote = null;

    hasSelectedNote() {
        return this.currentSelectedNote !== null;
    }

    getSelectedNote() {
        return this.currentSelectedNote;
    }

    drawSelectedNote(bounds) {
        const selectedNoteElementId = 'selected-note';
        const currentSelection = document.getElementById(selectedNoteElementId);
        if (currentSelection) {
            // Remove current selection
            currentSelection.outerHTML = "";
        }
        if (!bounds) {
            // Nothing to draw
            return;
        }
        const newSelection = document.createElement('div');
        newSelection.id = selectedNoteElementId;
        const padding = 2;
        newSelection.style.cssText = `
            background: rgb(255,0,0,0.3);
            position: absolute;
            left: ${bounds.x - padding}px;
            top: ${bounds.y - padding}px;
            z-index: 99999;
            width: ${bounds.w + padding * 2}px;
            height: ${bounds.h + padding * 2}px;
            pointer-events: none;
        `;
        const alphaTabElement = document.getElementById('alphaTab');
        alphaTabElement.appendChild(newSelection);
    }

    selectNextNote(currentNote, availableNotes) {
        const newNote = availableNotes.find((newNote) => newNote.string === currentNote.string);
        if (newNote) {
            return newNote;
        }
        return availableNotes.find((newNote) => newNote.string < currentNote.string) ?? availableNotes.find((newNote) => newNote.string > currentNote.string);
    }

    selectAvailableNotes(currentBeat, getBeat) {
        let beat = currentBeat;
        do {
            // Skip empty beats until the next beat with notes is found
            beat = getBeat(beat, getBeat);
        } while(beat && beat.notes.length === 0)
        return beat?.notes;
    }

    moveSelectedNoteHorizontal(getBeat) {
        const note = this.currentSelectedNote.note;
        if (!note) {
            return;
        }
        const notes = this.selectAvailableNotes(note.beat, getBeat);
        if (!notes) {
            return;
        }
        const newNote = this.selectNextNote(note, notes);
        if (!newNote) {
            return;
        }
        const newNoteData = at.renderer.boundsLookup.getNoteBounds(newNote);
        this.setSelectedNote({
            note: newNoteData.note,
            noteBounds: newNoteData.noteHeadBounds,
            beatBounds: newNoteData.beatBounds.visualBounds,
        });
        this.redrawOverlay();
    }

    moveSelectedNoteLeft() {
        return this.moveSelectedNoteHorizontal((beat) => beat.previousBeat);
    }

    moveSelectedNoteRight() {
        return this.moveSelectedNoteHorizontal((beat) => beat.nextBeat);
    }

    redrawOverlay() {
        // TODO: note bounds is stale, needs to be fetched again
        this.drawSelectedNote(this.currentSelectedNote?.noteBounds);
    }

    setSelectedNote(data) {
        this.currentSelectedNote = data;
    }

    toggleNoteSelection(data) {
        if (this.currentSelectedNote?.note?.id === data?.note?.id) {
            this.currentSelectedNote = null;
            this.drawSelectedNote(null);
        } else {
            this.currentSelectedNote = data;
            this.drawSelectedNote(data.noteBounds);
        }
    }
}

export default new SelectedNoteOverlay();
