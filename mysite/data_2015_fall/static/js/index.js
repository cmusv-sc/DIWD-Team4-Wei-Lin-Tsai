/**
 * Created by seckcoder on 12/2/15.
 */


$(document).ready(function () {
    function coauthor(root) {
        // ************** Generate the tree diagram  *****************
        var margin = {top: 0, right: 120, bottom: 20, left: 300},
            width = 960 - margin.right - margin.left,
            height = 600 - margin.top - margin.bottom;

        var i = 0;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select("#result-showcase").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        function update() {

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 180; });

            // Declare the nodesâ€¦
            var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });

            // Enter the nodes.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")"; });

            nodeEnter.append("circle")
                .attr("r", 10)
                .style("fill", "#fff");

            nodeEnter.append("text")
                .attr("x", function(d) {
                    return d.children || d._children ? -13 : 13; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start"; })
                .text(function(d) { return d.name; })
                .style("fill-opacity", 1);

            // Declare the linksâ€¦
            var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });

            // Enter the links.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", diagonal);
        }
        update();
    };
    $("#search-btn").click(function () {
        $("#result-showcase").empty();
        var type = $("#search_concept").text();
        var content = $("#search-content").val();
        if (type == 'coauthor') {
            $.ajax({
                url:'/dblp/coauthors/' + content
            }).done(function (ret) {
                coauthor(ret.coauthors);
            }).fail(function () {
            });
        } else if (type == 'coauthor2') {
            $.ajax({
                url:'/dblp/coauthors/2/' + content
            }).done(function (ret) {
                coauthor(ret.coauthors);
            }).fail(function () {

            })
        }
    });
    // var treeData = [
    // {"name": "Udo Pletat", "children": [{"name": "Toni Bollinger", "children": [{"name": "Sven Lorenz", "children": []}]}, {"name": "Sven Lorenz", "children": [{"name": "Toni Bollinger", "children": []}]}]}
    // ];
});
