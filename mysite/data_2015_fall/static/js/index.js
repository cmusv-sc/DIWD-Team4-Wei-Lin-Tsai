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

    function showVolumeContrib(journal, volumes) {
        console.log("haa");
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

    function showRecentSearch() {
        var recent_arr = [];
        if (Cookies.get('recent')) {
                recent_arr = Cookies.getJSON('recent');
            }
        $(".recent-search").children().next().remove();
            for (var i = 0; i<recent_arr.length; i++) {
                var type = JSON.parse(JSON.stringify(recent_arr[i]))['type']
                var query = JSON.parse(JSON.stringify(recent_arr[i]))['query']
                $(".recent-search").append('<li>'+ type + ':\t' + query +'</li>')
            }
            $(".lines").css("height", $(".recent-search").height());
    };
    
    $(document).ready(function() {
        showRecentSearch();
    });

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

    // showTopKPapers(papers);
    // showRelatedPapers(papers);
    // showVolumeContrib("IEEE XXX", volumes.volumes);
    // var treeData = [
    // {"name": "Udo Pletat", "children": [{"name": "Toni Bollinger", "children": [{"name": "Sven Lorenz", "children": []}]}, {"name": "Sven Lorenz", "children": [{"name": "Toni Bollinger", "children": []}]}]}
    // ];
});
