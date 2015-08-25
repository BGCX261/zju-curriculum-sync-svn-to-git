/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var Parser = Parser || {};
(function(p){
    function computeTableHeaderCellIndexes(t) {
        var matrix = [];
        var lookup = {};
        var thead = t.getElementsByTagName('tbody')[0];
        var trs = thead.getElementsByTagName('tr');
        for (var i=0; i<trs.length; i++) {
            var cells = trs[i].cells;
            for (var j=0; j<cells.length; j++) {
                var c = cells[j];
                var rowIndex = c.parentNode.rowIndex;
                var cellId = rowIndex+"-"+c.cellIndex;
                var rowSpan = c.rowSpan || 1;
                var colSpan = c.colSpan || 1
                var firstAvailCol;
                if(typeof(matrix[rowIndex])=="undefined") {
                    matrix[rowIndex] = [];
                }
                // Find first available column in the first row
                for (var k=0; k<matrix[rowIndex].length+1; k++) {
                    if (typeof(matrix[rowIndex][k])=="undefined") {
                        firstAvailCol = k;
                        break;
                    }
                }
                lookup[cellId] = firstAvailCol;
                for (var k=rowIndex; k<rowIndex+rowSpan; k++) {
                    if(typeof(matrix[k])=="undefined") {
                        matrix[k] = [];
                    }
                    var matrixrow = matrix[k];
                    for (var l=firstAvailCol; l<firstAvailCol+colSpan; l++) {
                        matrixrow[l] = "x";
                    }
                }
            }
        }
        return lookup;
    }

    function getActualCellIndex(cell) {
        var table = cell.parentNode.parentNode.parentNode;
        return computeTableHeaderCellIndexes(table)[cell.parentNode.rowIndex+"-"+cell.cellIndex];
    }

    p.parse = function(table,semester){
        var doms = table.querySelectorAll("input[value=NaNNaNNaNNaN]");
        var result = [];
        for (var i=0;i<doms.length;++i) {
            var d = doms[i];
            var td = d.parentNode;
            var tr = td.parentNode;
			
            var match = td.innerText.trim().match(/((.+)\b)*(.+)/gi)
            var courseName = match[0];
            var courseLocation = match[1];
            var courseDuration = match[2];
            var weekday = getActualCellIndex(td) - 1;
            var courseStart = tr.rowIndex;
            var courseLength = td.rowSpan;
            result[i] = {
                "weekday":weekday,
                "start":courseStart,
                "length":courseLength,
                "name":courseName,
                "pos":courseLocation,
                "time":courseDuration,
                "semester":semester
            };
        }
        return result;
    }
})(Parser)