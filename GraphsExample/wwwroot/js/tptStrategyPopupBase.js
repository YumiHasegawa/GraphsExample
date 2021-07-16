function updateViewByMode(mode) {
    if (mode === 'Scaled') {
        $('#amp label').text('Percentage (%)');
    }
    else if (mode === 'Fixed') {
        $('#amp label').text('Volume (lots)');
    }
}
