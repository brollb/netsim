/*
 * This router will find the path giving the fewest hops btwn
 * nodes
 */

var BasicRouter = function(network) {
    this._updateRoutes(network);
};

BasicRouter.prototype.getRoute = function(src, dst) {
    return this._routes[src][dst];
};

/**
 * Compute shortest paths between any two nodes and cache them 
 * for later use.
 *
 * @private
 * @return {undefined}
 */
BasicRouter.prototype._updateRoutes = function(network) {
    var nodes = this._getNodes(network),
        ids = Object.keys(nodes),
        visited,
        current,
        branches,
        routes = {},
        src,
        next;

    for (var i = ids.length; i--;) {
        src = ids[i];
        // BFS from each node
        visited = {};
        current = [src];
        next = [];

        routes[src] = {};
        routes[src][src] = [];
        while (current.length) {
            for (var j = current.length; j--;) {
                visited[current[j]] = true;
                branches = nodes[current[j]];
                for (var b = branches.length; b--;) {
                    if (!visited[branches[b]]) {
                        next.push(branches[b]);
                        // Record the path
                        routes[src][branches[b]] = routes[src][current[j]].slice();
                        routes[src][branches[b]].push(branches[b]);
                    }
                }
            }
            current = next;
            next = [];
        }

        // Add self shortest route
        routes[src][src].push(src);

    }

    return this._routes = routes;
};

/**
 * Retrieve all node ids from a network configuration.
 *
 * @private
 * @param network
 * @return {Array} nodes
 */
BasicRouter.prototype._getNodes = function(network) {
    var nodes = {},
        edge;

    for (var i = network.length; i--;) {
        edge = network[i];

        this._addNodes(nodes, edge.src, edge.dst);

        nodes[edge.src].push(edge.dst);
        nodes[edge.dst].push(edge.src);
    }

    return nodes;
};

BasicRouter.prototype._addNodes = function(nodes, id1, id2) {
    var node;
    for (var i = arguments.length-1; i > 0; i--) {
        node = arguments[i];
        if (!nodes[node]) {
            nodes[node] = [];
        }
    }
};

module.exports = BasicRouter;
