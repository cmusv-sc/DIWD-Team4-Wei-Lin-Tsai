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

    function showTopKPapers(papers) {
        var width = 960,
            height = 500;

        console.log(papers);
        function constructGraphFromPapers(papers) {
            var graph = {
                nodes: [],
                links: []
            };
            papers.forEach(function (paper) {
                var paperIdx = graph.nodes.length;
                graph.nodes.push({
                    name: paper.title
                });
                paper.authors.forEach(function (author) {
                    var authorIdx = graph.nodes.length;
                    graph.nodes.push({
                        name:author.name
                    });
                    graph.links.push({
                        source: authorIdx,
                        target: paperIdx
                    });
                });
            });
            return graph;
        };

        var graph = constructGraphFromPapers(papers);
        console.log(graph);
        /*
        var graph = {
            nodes: [
                {name: "wei"},
                {name: "jerry"},
                {name: "zack"},
            ],
            links: [
                {source: 1, target:0},
                {source:2, target:0}
            ]
        };
        */

        var color = d3.scale.category20();

        var svg = d3.select("#result-showcase").append("svg")
            .attr("width", width)
            .attr("height", height);

        var force = d3.layout.force()
            .charge(-120) // TODO: what's this?
            .linkDistance(30) // TODO: what's this?
            .size([width, height]);

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "papers");
            // .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "papers")
            // .style("fill", function(d) { return color(d.group); })
            .call(force.drag);

        node.append("circle").attr("r", 5);
        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function (d) { return d.name; });

        force.on("tick", function () {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        });
    };

    function showRelatedPapers(papers) {
        console.log("here");
        var html = "<div id='related-papers'>";
        papers.forEach(function (paper) {
           html += "<div class='one-paper'>";
           html += "<div class='title'>" +
                      "<span class='prefix'>[PAPER]</span> &nbsp" +
                      "<span class='content'>" + paper.title + "</span>" +
                    "</div>";

           html += "<div class='paper-other-info'>"
           paper.authors.forEach(function (author, index) {
               if (index == 0) {
                   html += author.name;
               } else {
                   html += ", " + author.name;
               }
           });
           html += " - " + paper.year + " - " + paper.journal;
           html += "</div>";
           html += "</div>";
        });
        html += "</div>";
        console.log(html);
        $("#result-showcase").append(html);
    };

    function showVolumeContrib1(journal, volumes) {
        function constructGraphFromVolumes(volumes) {
            var graph = {
                name: journal
            };
            graph.children = volumes.map(function (volume) {
                return {
                    name: "volume " + volume.volume,
                    children: volume.authors
                };
            });
            return graph;
        };
        var graph = constructGraphFromVolumes(volumes);
        coauthor(graph);
    };

    function showVolumeContrib(journal, volumes) {
        function constructGraphFromVolumes(volumes) {
            var graph = {
                name: journal
            };
            graph.children = volumes.map(function (volume) {
                return {
                    name: "volume " + volume.volume,
                    children: volume.authors
                };
            });
            return graph;
        };

        var root = constructGraphFromVolumes(volumes);
        var margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = 960 - margin.right - margin.left,
            height = 800 - margin.top - margin.bottom;

        var i = 0,
            duration = 750;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select("#result-showcase").append("svg")
            .attr("id","result-svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        root.x0 = height / 2;
        root.y0 = 0;

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        root.children.forEach(collapse);
        update(root);

        d3.select(self.frameElement).style("height", "800px");

        function update(source) {

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 180; });

            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .on("click", click);

            nodeEnter.append("circle")
                .attr("r", 1e-6)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeEnter.append("text")
                .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .text(function(d) { return d.name; })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("circle")
                .attr("r", 4.5)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    };

    function showExperts(experts) {
        console.log("test test");
        var html = "<div id='related-experts'>";
        experts.forEach(function (expert) {
           html += "<div class='one-expert'>";
           html += "<div class='expert-name'>" +
                      "<span class='prefix'>[Name]</span> &nbsp" +
                      "<span class='content'>" + expert.name + "</span>" +
                    "</div>";

           html += "</div>";
        });
        html += "</div>";
        console.log(html);
        $("#result-showcase").append(html);
        
    };

    function showPath(path) {
        var width = 960,
            height = 500;
        var nodes = {};
        var links = []
        // console.log(path);
        for (var i = 1; i < path.length; i++) {
            links.push({
                source: path[i],
                target: path[i-1]
            })
        };

        links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
        });
        var graph = {
            nodes:nodes,
            links:links
        };

        var svg = d3.select("#result-showcase").append("svg")
            .attr("width", width)
            .attr("height", height);

        var force = d3.layout.force()
            .nodes(d3.values(graph.nodes))
            .links(links)
            .charge(-120) // TODO: what's this?
            .linkDistance(30) // TODO: what's this?
            .size([width, height])
            .start();

        var link = svg.selectAll(".link")
            .data(force.links())
            .enter().append("line")
            .attr("class", "papers");
            // .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "papers")
            // .style("fill", function(d) { return color(d.group); })
            .call(force.drag);

        node.append("circle").attr("r", 5);
        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function (d) { return d.name; });

        force.on("tick", function () {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        });
    }
    function showRecentSearch() {
        var recent_arr = [];
        if (Cookies.get('recent')) {
                recent_arr = Cookies.getJSON('recent');
            }
        $(".recent-search").children().next().remove();
            $( "#clear-history" ).click(function() {
                $(".recent-search #history").remove();
                Cookies.remove('recent');
            });
            for (var i = 0; i<recent_arr.length; i++) {
                var type = JSON.parse(JSON.stringify(recent_arr[i]))['type']
                var query = JSON.parse(JSON.stringify(recent_arr[i]))['query']
                $(".recent-search").append('<li id="history">'+ type + ':\t' + query +'</li>')
            }
            $(".lines").css("height", $(".recent-search").height());
    };
    showRecentSearch();


    function showSequence(start_year, end_year, data) {
        /*
        code from http://neuralengr.com/asifr/journals/
         */
        // var data = [{"articles": [[2010, 6], [2011, 10], [2012, 11], [2013, 23], [2006, 1]], "total": 51, "name": "The Journal of neuroscience : the official journal of the Society for Neuroscience"}, {"articles": [[2008, 1], [2010, 3], [2011, 4], [2012, 17], [2013, 10]], "total": 35, "name": "Nature neuroscience"}, {"articles": [[2009, 1], [2010, 2], [2011, 8], [2012, 13], [2013, 11]], "total": 35, "name": "PloS one"}, {"articles": [[2007, 1], [2009, 3], [2010, 5], [2011, 7], [2012, 9], [2013, 9]], "total": 34, "name": "Nature"}, {"articles": [[2009, 2], [2010, 3], [2011, 4], [2012, 8], [2013, 9]], "total": 26, "name": "Neuron"}, {"articles": [[2009, 2], [2010, 2], [2011, 3], [2012, 9], [2013, 7]], "total": 23, "name": "Proceedings of the National Academy of Sciences of the United States of America"}, {"articles": [[2008, 1], [2010, 5], [2011, 10], [2012, 3], [2013, 3]], "total": 22, "name": "Nature methods"}, {"articles": [[2007, 1], [2009, 1], [2010, 3], [2011, 4], [2012, 4], [2013, 8]], "total": 21, "name": "Current opinion in neurobiology"}, {"articles": [[2006, 1], [2009, 3], [2010, 4], [2011, 1], [2012, 2], [2013, 7]], "total": 18, "name": "Science (New York, N.Y.)"}, {"articles": [[2010, 2], [2011, 4], [2012, 6], [2013, 4], [2007, 1]], "total": 17, "name": "Current biology : CB"}, {"articles": [[2010, 1], [2011, 3], [2012, 8], [2013, 3]], "total": 15, "name": "Journal of neurophysiology"}, {"articles": [[2009, 1], [2012, 4], [2013, 9]], "total": 14, "name": "Frontiers in neural circuits"}, {"articles": [[2012, 1], [2013, 13]], "total": 14, "name": "Brain research"}, {"articles": [[2009, 2], [2010, 1], [2011, 2], [2013, 8]], "total": 13, "name": "Frontiers in molecular neuroscience"}, {"articles": [[2008, 1], [2010, 2], [2011, 3], [2012, 3], [2013, 4]], "total": 13, "name": "The Journal of biological chemistry"}, {"articles": [[2009, 1], [2010, 1], [2011, 8], [2012, 2]], "total": 12, "name": "Conference proceedings : ... Annual International Conference of the IEEE Engineering in Medicine and Biology Society. IEEE Engineering in Medicine and Biology Society. Conference"}, {"articles": [[2012, 12]], "total": 12, "name": "Progress in brain research"}, {"articles": [[2009, 1], [2010, 1], [2012, 4], [2013, 6]], "total": 12, "name": "Journal of neuroscience methods"}, {"articles": [[2011, 3], [2012, 5], [2013, 3]], "total": 11, "name": "Journal of visualized experiments : JoVE"}, {"articles": [[2011, 1], [2012, 2], [2013, 8]], "total": 11, "name": "Neuroscience research"}, {"articles": [[2008, 1], [2010, 2], [2011, 5], [2012, 2]], "total": 10, "name": "Cell"}, {"articles": [[2012, 10]], "total": 10, "name": "Biological psychiatry"}, {"articles": [[2009, 1], [2011, 1], [2012, 5], [2013, 1]], "total": 8, "name": "The Journal of physiology"}, {"articles": [[2010, 2], [2012, 4], [2013, 1]], "total": 7, "name": "Nature protocols"}, {"articles": [[2013, 7]], "total": 7, "name": "Behavioural brain research"}, {"articles": [[2011, 5], [2013, 1]], "total": 6, "name": "Experimental physiology"}, {"articles": [[2011, 1], [2012, 1], [2013, 4]], "total": 6, "name": "Neuropharmacology"}, {"articles": [[2011, 1], [2012, 2], [2013, 2]], "total": 5, "name": "Neuroscience"}, {"articles": [[2011, 2], [2013, 3]], "total": 5, "name": "Nature communications"}, {"articles": [[2009, 1], [2010, 1], [2011, 1], [2012, 1], [2013, 1]], "total": 5, "name": "Neurosurgery"}];
        // var start_year = 2004,
        //    end_year = 2013;
        function truncate(str, maxLength, suffix) {
            if(str.length > maxLength) {
                str = str.substring(0, maxLength + 1);
                str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
                str = str + suffix;
            }
            return str;
        }

        var margin = {top: 20, right: 200, bottom: 0, left: 20},
            width = 300,
            height = 650;

        var c = d3.scale.category20c();

        var x = d3.scale.linear()
            .range([0, width]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top");

        var formatYears = d3.format("0000");
        xAxis.tickFormat(formatYears);

        var svg = d3.select("#result-showcase").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("margin-left", margin.left + "px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "sequence");

        x.domain([start_year, end_year]);
        var xScale = d3.scale.linear()
            .domain([start_year, end_year])
            .range([0, width]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + 0 + ")")
            .call(xAxis);

        for (var j = 0; j < data.length; j++) {
            var g = svg.append("g").attr("class","journal");

            var circles = g.selectAll("circle")
                .data(data[j]['articles'])
                .enter()
                .append("circle");

            var text = g.selectAll("text")
                .data(data[j]['articles'])
                .enter()
                .append("text");

            var rScale = d3.scale.linear()
                .domain([0, d3.max(data[j]['articles'], function(d) { return d[1]; })])
                .range([2, 9]);

            circles
                .attr("cx", function(d, i) { return xScale(d[0]); })
                .attr("cy", j*20+20)
                .attr("r", function(d) { return rScale(d[1]); })
                .style("fill", function(d) { return c(j); });

            text
                .attr("y", j*20+25)
                .attr("x",function(d, i) { return xScale(d[0])-5; })
                .attr("class","value")
                .text(function(d){ return d[1]; })
                .style("fill", function(d) { return c(j); })
                .style("display","none");

            g.append("text")
                .attr("y", j*20+25)
                .attr("x",width+20)
                .attr("class","label")
                .text(truncate(data[j]['name'],30,"..."))
                .style("fill", function(d) { return c(j); })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
        };

        function mouseover(p) {
            var g = d3.select(this).node().parentNode;
            d3.select(g).selectAll("circle").style("display","none");
            d3.select(g).selectAll("text.value").style("display","block");
        }

        function mouseout(p) {
            var g = d3.select(this).node().parentNode;
            d3.select(g).selectAll("circle").style("display","block");
            d3.select(g).selectAll("text.value").style("display","none");
        }
    };

    function showAuthorPubOverTime1() {
        var data = [
            {A: "AL", B: 2, C: 4, D: 5},
            {A: "BL", B: 3, C: 6, D: 2},
            {A: "CL", B: 9, C: 1, D: 15},
            {A: "DL", B: 20, C: 12, D: 13},
            {A: "DL", B: 20, C: 12, D: 13},
            {A: "DL", B: 20, C: 12, D: 13},
            {A: "DL", B: 20, C: 12, D: 13},
            {A: "DL", B: 20, C: 12, D: 13},
            {A: "DL", B: 20, C: 12, D: 13},
            {A: "DL", B: 20, C: 12, D: 13}
        ];
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .rangeRound([height, 0]);

        var color = d3.scale.ordinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        var svg = d3.select("#result-showcase").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // update(data);
        d3.csv("/static/test.csv", function (err, data) {
            console.log(data);
            color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

            data.forEach(function(d) {
                var y0 = 0;
                d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
                d.total = d.ages[d.ages.length - 1].y1;
            });

            data.sort(function(a, b) { return b.total - a.total; });

            x.domain(data.map(function(d) { return d.State; }));
            y.domain([0, d3.max(data, function(d) { return d.total; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Population");

            var state = svg.selectAll(".state")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; });

            state.selectAll("rect")
                .data(function(d) { return d.ages; })
                .enter().append("rect")
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.y1); })
                .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                .style("fill", function(d) { return color(d.name); });

            var legend = svg.selectAll(".legend")
                .data(color.domain().slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });

        });
    };

    function showAuthorPubOverTime(data) {
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 600 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1, 1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickValues(data.map(function (d) { return d.frequency ;}))
            .tickFormat(d3.format(",.0f"));

        var svg = d3.select("#result-showcase").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "barchart");

        update(data);
        function update(data) {
            /*
            data.forEach(function(d) {
                d.frequency = +d.frequency;
            });
            */

            var total = data.reduce(function (sum, v) {
                return sum + v.frequency;
            }, 0);

            x.domain(data.map(function(d) { return d.name; }));
            y.domain([0, total]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Papers/Year");


            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.name); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.frequency); })
                .attr("height", function(d) { return height - y(d.frequency); });

            // d3.select("input").on("change", change);

            var sortTimeout = setTimeout(function() {
                d3.select("input").property("checked", true).each(change);
            }, 2000);

            function change() {
                clearTimeout(sortTimeout);

                // Copy-on-write since tweens are evaluated after a delay.
                var x0 = x.domain(data.sort(this.checked
                    ? function(a, b) { return b.frequency - a.frequency; }
                    : function(a, b) { return d3.ascending(a.name, b.name); })
                    .map(function(d) { return d.name; }))
                    .copy();

                svg.selectAll(".bar")
                    .sort(function(a, b) { return x0(a.name) - x0(b.name); });

                var transition = svg.transition().duration(750),
                    delay = function(d, i) { return i * 50; };

                transition.selectAll(".bar")
                    .delay(delay)
                    .attr("x", function(d) { return x0(d.name); });

                transition.select(".x.axis")
                    .call(xAxis)
                    .selectAll("g")
                    .delay(delay);
            }
        };
    }

    function showNetwork(data) {

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

        root = data;

        update(root);

        function update(source) {

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
            return "translate(" + d.y + "," + d.x + ")"; })
            .on('mouseover', function(d){
                var g = d3.select(this); // The node
                var nodename = $('')
                // The class is used to remove the additional text later
                var info = g.append('text')
                 .classed('info', true)
                 .attr('x', -50)
                 .attr('y', 30)
                 .style('font-weight', "bold")
                 .text(function(d) { return d.name });
            })
            .on('mouseout', function(d){
                d3.select(this).select('text.info').remove();
            });

        nodeEnter.append("circle")
            .attr("r", 10)
            .style("fill", "#fff");

        nodeEnter.append("text")
            .attr("x", function(d) { 
            return d.children || d._children ? -13 : 13; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { 
            return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name })
            .style("fill-opacity", 1)
            .attr("class","truncate")
            .attr("name",function(d) { return d.name });

        // Declare the linksâ€¦
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

        // Enter the links.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", diagonal);

        }
        $('.truncate').succinct({
            size:30
        });
    }

/*
    =======================================================
    search click functions:
    =======================================================
*/
    $("#search-btn").click(function () {
        $("#result-showcase").empty();
        var type = $("#search_concept").text();
        var content = $("#search-content").val();

        // store most five recent search query
        var recent_arr = [];
        if (Cookies.get('recent')) {
            recent_arr = Cookies.getJSON('recent');
        }
        if (recent_arr.length == 5) {
            //remove from head
            recent_arr.splice(0,1);
        }
        recent_arr.push({type:type, query:content});
        Cookies.set('recent', recent_arr);

        showRecentSearch();

        if (type == 'coauthor') {
            $.ajax({
                url:'/dblp/coauthors/' + content
            }).done(function (ret) {
                console.log(ret);
                coauthor(ret.coauthors);
            }).fail(function () {
            });
        } else if (type == 'coauthor2') {
            $.ajax({
                url:'/dblp/coauthors/2/' + content
            }).done(function (ret) {
                coauthor(ret.coauthors);
            }).fail(function () {

            });
        } else if (type == 'papers') {
            var count = "10";
            var keywords = content.split('+');
            var re = /^\d+$/;
            // last word is number
            if (keywords.length > 1 && re.test(keywords[keywords.length-1])) {
                content = keywords.slice(0, keywords.length-1).join("+");
                count = keywords[keywords.length-1]
            }

            console.log(content, count);

            // top k related papers
            $.ajax({
                url:'/dblp/papers/' + content + "/" + count
            }).done(function (ret) {
                // console.log(ret);
                showTopKPapers(ret.papers);
            }).fail(function () {
            })
        } else if (type == 'papers-rel') {
            // papers interested in
            $.ajax({
                url:'/dblp/papers/' + content + '/10'
            }).done(function (ret) {
                showRelatedPapers(ret.papers);
            }).fail(function () {
            });
        } else if (type == 'volume-contrib') {
            console.log(content);
            $.ajax({
                url:'/dblp/contributions/' + content
            }).done(function (ret) {
                showVolumeContrib(content, ret.volumes);
            }).fail(function () {

            });
        } else if (type == 'smallworld') {
            var keywords = content.split('+');
            var name1 = keywords[0]
            var name2 = keywords[1];
            $.ajax({
                url: '/dblp/path/' + name1 + "/" + name2
            }).done(function (ret) {
                if (ret.found) {
                    showPath(ret.path);
                }
            }).fail(function () {
            })
        } else if (type == 'search-expert') {
            console.log(content);
            $.ajax({
                url:'/dblp/experts/' + content + '/10'
            }).done(function (ret) {
                showExperts(ret.experts);
            }).fail(function () {

            });
        } else if (type == 'search-collaborators') {
            var name = content.substring(0, content.indexOf('+'))
            var keywords = content.replace(name+'+', '')
            console.log(name, keywords);
            $.ajax({
                url:'/dblp/collaborators/' + name + '/' + keywords + '/10'
            }).done(function (ret) {
                showExperts(ret.collaborators);
            }).fail(function () {
            });
        } else if (type == 'top-cited-papers') {
            var journal_name = content.substring(0, content.indexOf('+'))
            var year = content.replace(journal_name+'+', '')
            console.log(name, keywords);
            $.ajax({
                url:'/dblp/cited/' + journal_name + '/' + year + '/10'
            }).done(function (ret) {
                showRelatedPapers(ret.papers);
            }).fail(function () {
            });
        } else if (type == 'pub-journals-overtime') {
            var years = content.split('+');
            console.log(years);
            $.ajax({
                url:'/dblp/journalsdist/' + years[0] + '/' + years[1]
            }).done(function (ret) {
                showSequence(years[0], years[1], ret.distribution);
            }).fail(function () {

            });
        } else if (type == 'pub-authors-overtime') {
            $.ajax({
               url:'/dblp/pubovertime/' + content
            }).done(function (ret) {
                showAuthorPubOverTime(ret.distribution);
            }).fail(function () {

            });
        } 
        else if (type == 'paper-paper') {
            console.log("jjj");
            $.ajax({
                url:'/dblp/citations/' + content
            }).done(function (ret) {
                showNetwork(ret);
            }).fail(function () {
            });
        } else if (type == 'author-author') {
            $.ajax({
                url:'/dblp/coauthors/3/' + content
            }).done(function (ret) {
                coauthor(ret.coauthors);
            }).fail(function () {

            });
        } else if (type == 'paper-author') {
            console.log(content);
            $.ajax({
                url:'/dblp/paper_author/' + content
            }).done(function (ret) {
                console.log(ret);
                showNetwork(ret);
            }).fail(function () {
            });
        }
    });
    var papers = [
        {
            authors: [ {name: "Wei Li"}, {name: "Jerry"}],
            title: "A stupid publication lallalala laalla b"
        },
        {
            authors: [ {name: "Zack Liang"}, {name: "Jerry"}],
            title: "A stupid publication bllalaalalla aaeaaaaaa"
        }
    ];
    var volumes = {"volumes": [{"volume": 16, "authors": [{"name": "weilin cai"}, {"name": "zack"}]}, {"volume": 10, "authors": [{"name": "jerry"}, {"name": "wei"}]}, {"volume": 15, "authors": [{"name": "zack"}, {"name": "wei"}, {"name": "weilin cai"}, {"name": "jerry"}]}]};

    var path = [{name: "wei"}, {name: "jerry"}, {name: "zack"}];

});
