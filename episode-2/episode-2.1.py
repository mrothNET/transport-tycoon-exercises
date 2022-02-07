import sys
from ortools.graph.pywrapgraph import DijkstraShortestPath


cities = []
city_index = {}
distances = {}


def createCity(city):
    try:
        return city_index[city.lower()]
    except:
        id = len(cities)
        cities.append(city)
        city_index[city.lower()] = id
        return id


def defineDistance(a, b, distance):
    id1 = createCity(a)
    id2 = createCity(b)
    distances[(min(id1, id2), max(id1, id2))] = distance


defineDistance("Cogburg", "Copperhold", 1047)
defineDistance("Leverstorm", "Irondale", 673)
defineDistance("Cogburg", "Steamdrift", 1269)
defineDistance("Copperhold", "Irondale", 345)
defineDistance("Copperhold", "Leverstorm", 569)
defineDistance("Leverstorm", "Gizbourne", 866)
defineDistance("Rustport", "Cogburg", 1421)
defineDistance("Rustport", "Steamdrift", 1947)
defineDistance("Rustport", "Gizbourne", 1220)
defineDistance("Irondale", "Gizbourne", 526)
defineDistance("Cogburg", "Irondale", 1034)
defineDistance("Rustport", "Irondale", 1302)


def route(source, destination):
    def dist(a, b):
        ab = (min(a, b), max(a, b))
        return distances.get(ab, 0)

    src_id = createCity(source)
    dst_id = createCity(destination)

    (success, result) = DijkstraShortestPath(
        len(cities), dst_id, src_id, dist, 0)

    if success:
        return [cities[id] for id in result]
    else:
        return []


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} SOURCE DESTINATION", file=sys.stderr)
        exit(1)

    [source, destination] = sys.argv[1:3]
    result = route(source, destination)
    print(",".join(result))
