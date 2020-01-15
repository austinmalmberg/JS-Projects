# QuadTree

Utilizes quadrants to quickly identify whether a point falls within a chosen area. Instead of checking every point each time the area changes, we identify which quadrants intersect the area then only loop through the points in these quadrants. Additional quadrants are added if the number of points exceed a predefined amount.
