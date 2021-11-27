class SelectedNoteOverlay {
    currentSelectedNote = null;

    setSelectedNoteFret(fret) {
        if (this.currentSelectedNote === null) {
            return;
        }
        this.currentSelectedNote.note.fret = fret;
        at.render();
    }

    hasSelectedNote() {
        return this.currentSelectedNote !== null;
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

    redrawOverlay() {
        if (this.currentSelectedNote) {
            // TODO: note bounds is stale, needs to be fetched again
            this.drawSelectedNote(this.currentSelectedNote.noteBounds);
        }
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
