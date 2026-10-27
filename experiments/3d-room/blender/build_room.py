"""
RootMap Play — 3D Lab: procedural miniature children's room.

Builds an open-front, dollhouse-style room entirely from code, then
(optionally) saves a .blend, exports a .glb for the web, and renders a
preview PNG for visual inspection.

Run from the repository root (Blender is not on PATH on macOS by default):

    /Applications/Blender.app/Contents/MacOS/Blender -b \
        --python experiments/3d-room/blender/build_room.py -- --all

Flags after `--`:
    --save      save experiments/3d-room/output/little_room.blend
    --export    export public/3d-lab/little-room.glb
    --render    render experiments/3d-room/output/preview.png
    --all       all of the above
(no flags)      build the scene only — handy from Blender's Text Editor

Conventions:
    * Units are metres at real child-furniture scale; Blender is Z-up,
      the glTF exporter converts to Y-up.
    * The room's open sides face -Y (front) and +X (right); the camera
      looks in from the front-right.
    * Every object is built in its own local space around its origin,
      so you can move/rotate whole pieces by editing one `location`.
    * Bevels are baked into the mesh (bmesh), not modifiers, so what you
      see in Blender is exactly what the glTF contains.
    * Materials are plain Principled BSDF (base colour / roughness /
      alpha) — the subset that maps 1:1 onto glTF PBR.
"""

import math
import os
import random
import sys

import bmesh
import bpy
from mathutils import Euler, Matrix, Vector

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------


def _repo_root():
    env = os.environ.get("ROOTMAP_ROOT")
    if env:
        return env
    here = os.path.abspath(__file__) if "__file__" in globals() else ""
    if here.endswith(".py") and os.path.isfile(here):
        # experiments/3d-room/blender/build_room.py -> repo root
        return os.path.normpath(os.path.join(os.path.dirname(here), "..", "..", ".."))
    # Running from Blender's Text Editor on an unsaved text block.
    return os.getcwd()


ROOT = _repo_root()
OUT_DIR = os.path.join(ROOT, "experiments", "3d-room", "output")
BLEND_PATH = os.path.join(OUT_DIR, "little_room.blend")
RENDER_PATH = os.path.join(OUT_DIR, "preview.png")
GLB_PATH = os.path.join(ROOT, "public", "3d-lab", "little-room.glb")

# ---------------------------------------------------------------------------
# Palette — sRGB hex, warm and muted. Edit here to restyle the whole room.
# (name: (hex, roughness))
# ---------------------------------------------------------------------------

PALETTE = {
    # shell
    "wall_cream": ("#EFE6D3", 0.92),
    "wainscot": ("#E2D3B6", 0.85),
    "trim_paint": ("#E9DDC6", 0.7),
    "base_walnut": ("#6B4A33", 0.55),
    "oak_a": ("#C69D6E", 0.62),
    "oak_b": ("#C09669", 0.62),
    "oak_c": ("#CAA274", 0.62),
    "window_wood": ("#C9A57B", 0.6),
    "glass": ("#DDE7E4", 0.08),
    # furniture
    "birch": ("#DCBE93", 0.6),
    "beech": ("#C89C6C", 0.6),
    "walnut": ("#7A5539", 0.55),
    "rug_oat": ("#E6D8BC", 1.0),
    "rug_sage": ("#A9B394", 1.0),
    "linen": ("#D9CDB6", 1.0),
    "paper": ("#F4EEE2", 0.9),
    # books
    "book_rose": ("#C49488", 0.8),
    "book_sage": ("#97A887", 0.8),
    "book_ochre": ("#CFA25A", 0.8),
    "book_slate": ("#8797A3", 0.8),
    "book_cream": ("#E7DBC2", 0.8),
    "book_terracotta": ("#B5735A", 0.8),
    "book_plum": ("#8E7480", 0.8),
    # wall art
    "frame_wood": ("#A57C54", 0.55),
    "mat_cream": ("#F2EBDD", 0.95),
    "art_indigo": ("#4A5573", 0.9),
    "art_ochre": ("#D8AE63", 0.9),
    "art_peach": ("#E6BE9B", 0.9),
    "art_rust": ("#A7654B", 0.9),
    "art_sage": ("#AEB89C", 0.9),
    "art_moss": ("#7F8E68", 0.9),
    "art_cream": ("#F3E8D2", 0.9),
    # plant
    "terracotta": ("#B9775A", 0.85),
    "soil": ("#4A3628", 1.0),
    "leaf": ("#748A59", 0.55),
    "leaf_dark": ("#5F7449", 0.55),
    # toys
    "toy_rust": ("#B86D52", 0.5),
    "toy_ochre": ("#D6A957", 0.5),
    "toy_sage": ("#9AAB86", 0.5),
    "toy_blue": ("#8FA3B1", 0.5),
    "toy_cream": ("#EDE1C8", 0.5),
}

# Lighting used for the Blender render. The web viewer mirrors the sun
# direction in src/features/threeDLab/RoomViewer.tsx.
LIGHTING = {
    # Direction the sunlight travels (Blender Z-up): low and from the left,
    # so it pours through the window onto the rug instead of over the walls.
    "sun_direction": (0.92, -0.1, -0.62),
    "sun_strength": 6.5,
    "sun_color": "#FFE2BC",
    "sun_angle_deg": 3.0,  # softness of sun shadows
    "fill_strength": 260.0,  # large soft area light from the open front
    "fill_color": "#FFF1DE",
    "world_color": "#E9DCC8",  # ambient bounce
    "world_strength": 0.6,
    "backdrop_color": "#F1E8DA",  # what the camera sees behind the room

}

# ---------------------------------------------------------------------------
# Room dimensions (metres)
# ---------------------------------------------------------------------------

ROOM_W = 3.4  # interior x: -1.7..1.7
ROOM_D = 2.6  # interior y: -1.3..1.3
WALL_H = 2.3
WALL_T = 0.12
BASE_T = 0.16  # walnut diorama base under the floor
WINDOW = {"y0": -0.5, "y1": 0.42, "z0": 0.98, "z1": 1.9}

X0, X1 = -ROOM_W / 2, ROOM_W / 2
Y0, Y1 = -ROOM_D / 2, ROOM_D / 2

# ---------------------------------------------------------------------------
# Small utilities
# ---------------------------------------------------------------------------


def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_rgb(hex_str):
    h = hex_str.lstrip("#")
    return tuple(srgb_to_linear(int(h[i : i + 2], 16) / 255) for i in (0, 2, 4))


def clear_scene():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for coll in list(bpy.data.collections):
        bpy.data.collections.remove(coll)
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for item in list(block):
            block.remove(item)


MATERIALS = {}


def material(key):
    if key in MATERIALS:
        return MATERIALS[key]
    hex_str, rough = PALETTE[key]
    mat = bpy.data.materials.new(key)
    if bpy.app.version < (5, 0, 0):
        mat.use_nodes = True  # always on (and deprecated) from Blender 5
    bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    rgb = hex_rgb(hex_str)
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = 0.0
    mat.diffuse_color = (*rgb, 1.0)
    if key == "glass":
        bsdf.inputs["Alpha"].default_value = 0.18
        if hasattr(mat, "surface_render_method"):
            mat.surface_render_method = "BLENDED"
        else:
            mat.blend_method = "BLEND"
    MATERIALS[key] = mat
    return mat


def collection(name):
    coll = bpy.data.collections.get(name)
    if coll is None:
        coll = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(coll)
    return coll


# ---------------------------------------------------------------------------
# Mesh builder: several primitives -> one object with multiple materials
# ---------------------------------------------------------------------------


class Part:
    """Accumulates primitives into one bmesh, then becomes one object."""

    def __init__(self, name):
        self.name = name
        self.bm = bmesh.new()
        self.mats = []

    def _mat_index(self, key):
        if key not in self.mats:
            self.mats.append(key)
        return self.mats.index(key)

    def _merge(self, tmp, mat, loc, rot, smooth):
        idx = self._mat_index(mat)
        for f in tmp.faces:
            f.material_index = idx
            f.smooth = smooth
        tmp.transform(Matrix.Translation(Vector(loc)) @ Euler(rot).to_matrix().to_4x4())
        mesh = bpy.data.meshes.new("_tmp")
        tmp.to_mesh(mesh)
        tmp.free()
        self.bm.from_mesh(mesh)
        bpy.data.meshes.remove(mesh)

    def box(self, size, loc, mat, rot=(0, 0, 0), bevel=0.0, segments=2):
        tmp = bmesh.new()
        bmesh.ops.create_cube(tmp, size=1.0)
        bmesh.ops.scale(tmp, vec=Vector(size), verts=tmp.verts)
        if bevel > 0:
            bmesh.ops.bevel(
                tmp,
                geom=list(tmp.edges),
                offset=min(bevel, min(size) * 0.45),
                segments=segments,
                profile=0.5,
                affect="EDGES",
            )
        self._merge(tmp, mat, loc, rot, smooth=bevel > 0 and segments > 1)
        return self

    def cylinder(self, radius, depth, loc, mat, rot=(0, 0, 0), radius_top=None, segments=16):
        tmp = bmesh.new()
        bmesh.ops.create_cone(
            tmp,
            cap_ends=True,
            segments=segments,
            radius1=radius,
            radius2=radius if radius_top is None else radius_top,
            depth=depth,
        )
        self._merge(tmp, mat, loc, rot, smooth=True)
        return self

    def sphere(self, radius, loc, mat, scale=(1, 1, 1), rot=(0, 0, 0), u=12, v=8, clip_below=False):
        tmp = bmesh.new()
        bmesh.ops.create_uvsphere(tmp, u_segments=u, v_segments=v, radius=radius)
        bmesh.ops.scale(tmp, vec=Vector(scale), verts=tmp.verts)
        if clip_below:  # keep only the upper half (e.g. a hill on a canvas edge)
            geom = list(tmp.verts) + list(tmp.edges) + list(tmp.faces)
            bmesh.ops.bisect_plane(tmp, geom=geom, plane_co=(0, 0, 0), plane_no=(0, 0, -1), clear_outer=True)
        self._merge(tmp, mat, loc, rot, smooth=True)
        return self

    def build(self, coll, location=(0, 0, 0), rotation=(0, 0, 0), parent=None):
        bm = self.bm
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
        # Auto-smooth: soft bevels and round parts stay smooth, real
        # corners stay crisp. Sharp edges survive glTF export.
        for e in bm.edges:
            if len(e.link_faces) == 2:
                e.smooth = e.calc_face_angle(0.0) < math.radians(35)
            else:
                e.smooth = False
        mesh = bpy.data.meshes.new(self.name)
        bm.to_mesh(mesh)
        bm.free()
        for key in self.mats:
            mesh.materials.append(material(key))
        obj = bpy.data.objects.new(self.name, mesh)
        obj.location = location
        obj.rotation_euler = rotation
        coll.objects.link(obj)
        if parent is not None:
            obj.parent = parent
        return obj


# ---------------------------------------------------------------------------
# Room shell
# ---------------------------------------------------------------------------


def build_shell():
    coll = collection("Room_Shell")

    # Walnut diorama base — reads as "a lovingly made miniature".
    Part("room_base").box(
        (ROOM_W + WALL_T + 0.04, ROOM_D + WALL_T + 0.08, BASE_T),
        ((X0 - WALL_T + X1 + 0.04) / 2, (Y0 - 0.08 + Y1 + WALL_T) / 2, -BASE_T / 2 - 0.022),
        "base_walnut",
        bevel=0.02,
        segments=3,
    ).build(coll)

    # Oak floorboards running front-to-back, staggered joints, three tones.
    rng = random.Random(11)
    floor = Part("floor_oak")
    board_w = 0.16
    n = round(ROOM_W / board_w)
    for i in range(n):
        x = X0 + board_w * (i + 0.5)
        split = Y0 + rng.uniform(0.6, 2.4)
        for ya, yb in ((Y0, split), (split, Y1)):
            floor.box(
                (board_w - 0.004, yb - ya - 0.004, 0.022),
                (x, (ya + yb) / 2, -0.011),
                rng.choice(("oak_a", "oak_b", "oak_c")),
                bevel=0.003,
                segments=1,
            )
    floor.build(coll)

    # Back wall (spans behind the left wall so the corner is closed).
    Part("wall_back").box(
        (ROOM_W + WALL_T, WALL_T, WALL_H),
        ((X0 - WALL_T + X1) / 2, Y1 + WALL_T / 2, WALL_H / 2),
        "wall_cream",
    ).build(coll)

    # Left wall assembled around the window opening (no booleans).
    w = WINDOW
    lx = X0 - WALL_T / 2
    left = Part("wall_left")
    left.box((WALL_T, ROOM_D, w["z0"]), (lx, 0, w["z0"] / 2), "wall_cream")
    left.box((WALL_T, ROOM_D, WALL_H - w["z1"]), (lx, 0, (w["z1"] + WALL_H) / 2), "wall_cream")
    left.box((WALL_T, w["y0"] - Y0, w["z1"] - w["z0"]), (lx, (Y0 + w["y0"]) / 2, (w["z0"] + w["z1"]) / 2), "wall_cream")
    left.box((WALL_T, Y1 - w["y1"], w["z1"] - w["z0"]), (lx, (w["y1"] + Y1) / 2, (w["z0"] + w["z1"]) / 2), "wall_cream")
    left.build(coll)

    # Painted wainscot panels, a slim wooden dado rail, skirting and a
    # wooden cap along the cut wall tops (dollhouse detail).
    trim = Part("wall_trim")
    pan_h = 0.86
    trim.box((ROOM_W, 0.012, pan_h), (0, Y1 - 0.006, pan_h / 2), "wainscot")
    trim.box((0.012, ROOM_D, pan_h), (X0 + 0.006, 0, pan_h / 2), "wainscot")
    # vertical panel battens
    for i in range(1, 9):
        trim.box((0.03, 0.012, pan_h - 0.12), (X0 + i * ROOM_W / 9, Y1 - 0.018, pan_h / 2 + 0.03), "wainscot", bevel=0.004, segments=1)
    for i in range(1, 7):
        trim.box((0.012, 0.03, pan_h - 0.12), (X0 + 0.018, Y0 + i * ROOM_D / 7, pan_h / 2 + 0.03), "wainscot", bevel=0.004, segments=1)
    # dado rail
    trim.box((ROOM_W, 0.03, 0.035), (0, Y1 - 0.02, pan_h), "trim_paint", bevel=0.008, segments=2)
    trim.box((0.03, ROOM_D, 0.035), (X0 + 0.02, 0, pan_h), "trim_paint", bevel=0.008, segments=2)
    # skirting
    trim.box((ROOM_W, 0.022, 0.09), (0, Y1 - 0.024, 0.045), "trim_paint", bevel=0.005, segments=2)
    trim.box((0.022, ROOM_D, 0.09), (X0 + 0.024, 0, 0.045), "trim_paint", bevel=0.005, segments=2)
    # wooden caps on wall tops and exposed front/right wall edges
    cap = WALL_T + 0.02
    trim.box((ROOM_W + WALL_T + 0.02, cap, 0.035), ((X0 - WALL_T + X1) / 2, Y1 + WALL_T / 2, WALL_H + 0.017), "window_wood", bevel=0.008)
    trim.box((cap, ROOM_D + WALL_T, 0.035), (lx, WALL_T / 2, WALL_H + 0.017), "window_wood", bevel=0.008)
    trim.box((cap, 0.03, WALL_H), (lx, Y0 + 0.004, WALL_H / 2), "window_wood", bevel=0.006)
    trim.box((0.03, cap, WALL_H), (X1 + 0.004, Y1 + WALL_T / 2, WALL_H / 2), "window_wood", bevel=0.006)
    trim.build(coll)

    build_window(coll)


def build_window(coll):
    w = WINDOW
    width, height = w["y1"] - w["y0"], w["z1"] - w["z0"]
    cy, cz = (w["y0"] + w["y1"]) / 2, (w["z0"] + w["z1"]) / 2
    depth = WALL_T + 0.03
    m = 0.06  # frame member
    win = Part("window")
    # outer frame
    win.box((depth, width + 2 * m, m), (0, 0, height / 2 + m / 2), "window_wood", bevel=0.008)
    win.box((depth, width + 2 * m, m), (0, 0, -height / 2 - m / 2), "window_wood", bevel=0.008)
    win.box((depth, m, height), (0, -width / 2 - m / 2, 0), "window_wood", bevel=0.008)
    win.box((depth, m, height), (0, width / 2 + m / 2, 0), "window_wood", bevel=0.008)
    # mullion cross (thin glazing bars)
    win.box((0.04, 0.03, height), (0, 0, 0), "window_wood", bevel=0.006)
    win.box((0.04, width, 0.03), (0, 0, height * 0.12), "window_wood", bevel=0.006)
    # deep interior sill
    win.box((0.13, width + 0.22, 0.035), (0.09, 0, -height / 2 - m + 0.017), "window_wood", bevel=0.01, segments=3)
    win.build(coll, location=(X0 - WALL_T / 2, cy, cz))

    Part("window_glass").box((0.006, width, height), (0, 0, 0), "glass").build(
        coll, location=(X0 - WALL_T / 2, cy, cz)
    )


# ---------------------------------------------------------------------------
# Furniture
# ---------------------------------------------------------------------------


def build_rug(coll):
    rug = Part("rug_round")
    rug.cylinder(0.86, 0.012, (0, 0, 0.006), "rug_sage", segments=48)
    rug.cylinder(0.79, 0.014, (0, 0, 0.007), "rug_oat", segments=48)
    rug.cylinder(0.46, 0.016, (0, 0, 0.008), "rug_sage", segments=40)
    rug.cylinder(0.43, 0.018, (0, 0, 0.009), "rug_oat", segments=40)
    rug.build(coll, location=(0.12, -0.02, 0))


def build_table(coll):
    h, top_t, w, d = 0.50, 0.032, 0.82, 0.56
    t = Part("table_child")
    t.box((w, d, top_t), (0, 0, h - top_t / 2), "birch", bevel=0.012, segments=3)
    leg_h = h - top_t
    for sx in (-1, 1):
        for sy in (-1, 1):
            t.cylinder(0.022, leg_h, (sx * (w / 2 - 0.07), sy * (d / 2 - 0.07), leg_h / 2), "birch",
                       radius_top=0.026, segments=12, rot=(sy * 0.05, -sx * 0.05, 0))
    # aprons
    t.box((w - 0.16, 0.018, 0.06), (0, d / 2 - 0.07, leg_h - 0.03), "birch", bevel=0.004, segments=1)
    t.box((w - 0.16, 0.018, 0.06), (0, -(d / 2 - 0.07), leg_h - 0.03), "birch", bevel=0.004, segments=1)
    t.box((0.018, d - 0.16, 0.06), (w / 2 - 0.07, 0, leg_h - 0.03), "birch", bevel=0.004, segments=1)
    t.box((0.018, d - 0.16, 0.06), (-(w / 2 - 0.07), 0, leg_h - 0.03), "birch", bevel=0.004, segments=1)
    table = t.build(coll, location=(0.3, 0.08, 0), rotation=(0, 0, math.radians(4)))

    # A drawing in progress: paper and two crayons, parented to the table.
    things = Part("table_drawing")
    things.box((0.30, 0.21, 0.002), (0.02, -0.02, h + 0.001), "paper", rot=(0, 0, math.radians(-8)))
    things.box((0.22, 0.16, 0.002), (-0.20, 0.10, h + 0.003), "paper", rot=(0, 0, math.radians(14)))
    things.cylinder(0.006, 0.09, (0.16, -0.12, h + 0.008), "toy_rust", rot=(math.pi / 2, 0, math.radians(30)), segments=8)
    things.cylinder(0.006, 0.09, (0.20, -0.08, h + 0.008), "toy_blue", rot=(math.pi / 2, 0, math.radians(70)), segments=8)
    things.build(coll, parent=table)


def build_chair(coll):
    seat_h, s = 0.28, 0.30
    c = Part("chair_child")
    c.box((s, s, 0.026), (0, 0, seat_h - 0.013), "beech", bevel=0.01, segments=3)
    leg = seat_h - 0.026
    for sx in (-1, 1):
        # front legs
        c.cylinder(0.016, leg, (s / 2 - 0.035, sx * (s / 2 - 0.035), leg / 2), "beech", segments=10)
        # rear legs continue up as back posts
        c.cylinder(0.017, 0.58, (-(s / 2 - 0.035), sx * (s / 2 - 0.035), 0.29), "beech", segments=10)
    # back rails
    c.box((0.022, s - 0.05, 0.075), (-(s / 2 - 0.035), 0, 0.53), "beech", bevel=0.008, segments=3)
    c.box((0.018, s - 0.06, 0.035), (-(s / 2 - 0.035), 0, 0.40), "beech", bevel=0.006, segments=2)
    # stretchers
    for sx in (-1, 1):
        c.cylinder(0.008, s - 0.07, (0, sx * (s / 2 - 0.035), 0.09), "beech", rot=(0, math.pi / 2, 0), segments=8)
    c.build(coll, location=(-0.3, 0.0, 0), rotation=(0, 0, math.radians(-12)))


def build_bookshelf(coll, books_coll):
    w, h, d, t = 1.0, 0.80, 0.30, 0.022
    s = Part("bookshelf")
    for sx in (-1, 1):
        s.box((t, d, h), (sx * (w / 2 - t / 2), 0, h / 2), "birch", bevel=0.006, segments=2)
    shelf_z = (0.05, 0.40, h - t / 2)
    for z in shelf_z:
        s.box((w - (0 if z == shelf_z[-1] else 2 * t), d, t), (0, 0, z), "birch", bevel=0.006, segments=2)
    s.box((t, d - 0.02, 0.33), (0.08, 0, 0.225), "birch", bevel=0.004, segments=1)  # cubby divider
    s.box((w - 2 * t, 0.01, h - 0.06), (0, d / 2 - 0.005, h / 2), "beech")  # back panel
    s.box((w - 0.04, d - 0.02, 0.03), (0, 0, 0.015), "birch")  # plinth
    shelf = s.build(coll, location=(1.1, Y1 - d / 2 - 0.03, 0))

    rng = random.Random(4)
    colors = ["book_rose", "book_sage", "book_ochre", "book_slate", "book_cream", "book_terracotta", "book_plum"]

    def row(name, x_start, x_end, z, max_h, lean_last):
        p = Part(name)
        x = x_start
        while True:
            th = rng.uniform(0.022, 0.042)
            if x + th > x_end - (0.08 if lean_last else 0):
                break
            bh = rng.uniform(0.6, 0.95) * max_h
            bd = rng.uniform(0.15, 0.2)
            p.box((th, bd, bh), (x + th / 2, 0.02, z + bh / 2), rng.choice(colors), bevel=0.003, segments=1)
            x += th + 0.002
        if lean_last:
            bh = 0.8 * max_h
            ang = math.radians(18)
            p.box((0.03, 0.17, bh), (x + 0.015 + math.sin(ang) * bh / 2, 0.02, z + math.cos(ang) * bh / 2),
                  rng.choice(colors), rot=(0, ang, 0), bevel=0.003, segments=1)
        p.build(books_coll, parent=shelf)

    row("books_lower", -0.47, 0.06, 0.061, 0.30, lean_last=True)
    row("books_upper", -0.47, -0.05, 0.411, 0.34, lean_last=True)
    # a small stack of picture books lying flat in the lower right cubby
    stack = Part("books_stack")
    zz = 0.061
    for i, (bw, bd) in enumerate(((0.28, 0.21), (0.26, 0.2), (0.24, 0.18))):
        th = 0.025
        stack.box((bw, bd, th), (0.29 + i * 0.006, 0.01, zz + th / 2), colors[(i * 3) % len(colors)],
                  rot=(0, 0, math.radians(3 - i * 4)), bevel=0.003, segments=1)
        zz += th
    stack.build(books_coll, parent=shelf)
    return shelf, h


def build_cushion(coll):
    c = Part("floor_cushion")
    c.box((0.56, 0.56, 0.13), (0, 0, 0.065), "linen", bevel=0.05, segments=4)
    c.sphere(0.018, (0, 0, 0.13), "walnut", scale=(1, 1, 0.5))  # tufted button
    c.build(coll, location=(-1.2, 0.86, 0), rotation=(0, 0, math.radians(18)))


# ---------------------------------------------------------------------------
# Wall art — the three interactive frames
# ---------------------------------------------------------------------------


def build_frames():
    coll = collection("Wall_Art")
    # name, width, height, x, z, art builder
    specs = [
        ("frame_pocket_universe", 0.42, 0.54, -0.62, 1.42),
        ("frame_secret_room", 0.56, 0.42, 0.02, 1.52),
        ("frame_life_movie", 0.38, 0.50, 0.62, 1.38),
    ]
    for name, fw, fh, x, z in specs:
        b, depth = 0.04, 0.035
        f = Part(name)
        f.box((fw, depth, b), (0, 0, fh / 2 - b / 2), "frame_wood", bevel=0.007)
        f.box((fw, depth, b), (0, 0, -fh / 2 + b / 2), "frame_wood", bevel=0.007)
        f.box((b, depth, fh - 2 * b), (-fw / 2 + b / 2, 0, 0), "frame_wood", bevel=0.007)
        f.box((b, depth, fh - 2 * b), (fw / 2 - b / 2, 0, 0), "frame_wood", bevel=0.007)
        # recessed cream mat
        f.box((fw - 2 * b + 0.01, 0.006, fh - 2 * b + 0.01), (0, 0.008, 0), "mat_cream")
        frame = f.build(coll, location=(x, Y1 - depth / 2 - 0.004, z))

        aw, ah = fw - 2 * b - 0.08, fh - 2 * b - 0.08
        art = Part(name + "_art")
        y = 0.003  # just in front of the mat (local -y faces the room)
        flat = (math.pi / 2, 0, 0)  # cylinder axis along y -> discs on the wall
        if name == "frame_pocket_universe":
            art.box((aw, 0.002, ah), (0, y, 0), "art_indigo")
            art.cylinder(0.065, 0.004, (0.02, y - 0.002, 0.02), "art_ochre", rot=flat, segments=24)
            art.box((0.20, 0.003, 0.012), (0.02, y - 0.004, 0.02), "art_cream", rot=(0, math.radians(-18), 0))
            for sx, sz in ((-0.1, 0.13), (0.1, 0.15), (-0.08, -0.12), (0.11, -0.09), (-0.02, -0.16)):
                art.cylinder(0.008, 0.004, (sx, y - 0.002, sz), "art_cream", rot=flat, segments=8)
        elif name == "frame_secret_room":
            art.box((aw, 0.002, ah), (0, y, 0), "art_peach")
            art.box((0.11, 0.003, 0.11), (0, y - 0.002, -ah / 2 + 0.055), "art_rust")
            art.cylinder(0.055, 0.003, (0, y - 0.002, -ah / 2 + 0.11), "art_rust", rot=flat, segments=20)
            art.cylinder(0.007, 0.004, (0.03, y - 0.004, -ah / 2 + 0.06), "art_ochre", rot=flat, segments=8)
            art.box((aw, 0.003, 0.02), (0, y - 0.002, -ah / 2 + 0.01), "art_moss")
        else:  # frame_life_movie
            art.box((aw, 0.002, ah), (0, y, 0), "art_sage")
            art.cylinder(0.05, 0.003, (0.04, y - 0.002, 0.06), "art_cream", rot=flat, segments=20)
            art.sphere(0.13, (-0.04, y - 0.002, -ah / 2), "art_moss", scale=(1, 0.01, 0.6), clip_below=True)
            art.sphere(0.1, (0.06, y - 0.003, -ah / 2), "art_ochre", scale=(1, 0.01, 0.5), clip_below=True)
            # film-strip ticks along top and bottom
            for i in range(5):
                xx = -aw / 2 + (i + 0.5) * aw / 5
                art.box((0.02, 0.003, 0.012), (xx, y - 0.002, ah / 2 - 0.012), "art_cream")
        # Art meshes extend beyond the canvas edge in a couple of places;
        # clip them visually by keeping them small enough (see sizes above).
        art.build(coll, parent=frame)


# ---------------------------------------------------------------------------
# Plant and toys
# ---------------------------------------------------------------------------


def build_plant(coll, shelf, shelf_h):
    p = Part("plant_potted")
    p.cylinder(0.075, 0.13, (0, 0, 0.065), "terracotta", radius_top=0.09, segments=20)
    p.cylinder(0.095, 0.025, (0, 0, 0.128), "terracotta", segments=20)
    p.cylinder(0.082, 0.01, (0, 0, 0.133), "soil", segments=20)
    rng = random.Random(3)
    for i in range(15):
        a = i * 2.4 + rng.uniform(-0.2, 0.2)
        tilt = rng.uniform(0.35, 0.9)
        length = rng.uniform(0.14, 0.3)
        base = Vector((0, 0, 0.135))
        direction = Vector((math.cos(a) * math.sin(tilt), math.sin(a) * math.sin(tilt), math.cos(tilt)))
        tip = base + direction * length
        stem_mid = (base + tip) / 2
        # stem: cylinder aligned to direction
        rot = direction.to_track_quat("Z", "Y").to_euler()
        p.cylinder(0.004, length, tuple(stem_mid), "leaf_dark", rot=tuple(rot), segments=5)
        leaf_rot = (direction * 1.0).to_track_quat("Y", "Z").to_euler()
        leaf_rot.rotate_axis("Y", rng.uniform(-0.3, 0.3))
        p.sphere(0.058, tuple(tip + direction * 0.04), rng.choice(("leaf", "leaf_dark")),
                 scale=(0.75, 1.5, 0.12), rot=tuple(leaf_rot), u=10, v=6)
    p.build(coll, location=(0.33, 0.0, shelf_h), parent=shelf)


def build_toys(coll, shelf, shelf_h):
    # Rainbow stacker in muted tones, on the shelf top.
    st = Part("toy_stacker")
    st.cylinder(0.075, 0.025, (0, 0, 0.0125), "birch", segments=20)
    st.cylinder(0.012, 0.2, (0, 0, 0.11), "birch", segments=10)
    z = 0.025
    for r, key in ((0.07, "toy_rust"), (0.062, "toy_ochre"), (0.054, "toy_sage"), (0.046, "toy_blue"), (0.038, "toy_cream")):
        hh = r * 0.62
        st.sphere(r, (0, 0, z + hh / 2), key, scale=(1, 1, 0.31), u=20, v=10)
        z += hh
    st.sphere(0.026, (0, 0, z + 0.02), "birch", u=12, v=8)
    st.build(coll, location=(-0.3, -0.02, shelf_h), parent=shelf)

    # Wooden blocks on the rug: a little tower and one tumbled block.
    bl = Part("toy_blocks")
    s = 0.065
    bl.box((s, s, s), (0, 0, s / 2), "birch", bevel=0.006)
    bl.box((s, s, s), (0.004, 0.002, s * 1.5), "toy_sage", bevel=0.006, rot=(0, 0, 0.18))
    bl.box((s, s, s), (-0.003, 0.0, s * 2.5), "toy_ochre", bevel=0.006, rot=(0, 0, -0.12))
    bl.box((s, s, s), (0.11, -0.06, s / 2), "toy_rust", bevel=0.006, rot=(0, 0, 0.6))
    bl.cylinder(s / 2, s, (0.05, 0.1, s / 2), "toy_blue", segments=16)
    bl.build(coll, location=(0.62, -0.58, 0.018))

    # Small wooden car near the front edge of the rug.
    car = Part("toy_car")
    car.box((0.2, 0.09, 0.05), (0, 0, 0.045), "toy_rust", bevel=0.015, segments=3)
    car.box((0.1, 0.08, 0.05), (-0.015, 0, 0.09), "birch", bevel=0.015, segments=3)
    for sx in (-1, 1):
        for sy in (-1, 1):
            car.cylinder(0.024, 0.016, (sx * 0.062, sy * 0.05, 0.024), "walnut", rot=(math.pi / 2, 0, 0), segments=14)
    car.build(coll, location=(-0.62, -0.62, 0.0), rotation=(0, 0, math.radians(-28)))


# ---------------------------------------------------------------------------
# Lighting, camera, render settings (Blender preview only — not exported)
# ---------------------------------------------------------------------------


def build_lighting_and_camera():
    scene = bpy.context.scene
    lc = collection("Lighting")

    sun_data = bpy.data.lights.new("sun_window", type="SUN")
    sun_data.energy = LIGHTING["sun_strength"]
    sun_data.color = hex_rgb(LIGHTING["sun_color"])
    sun_data.angle = math.radians(LIGHTING["sun_angle_deg"])
    sun = bpy.data.objects.new("sun_window", sun_data)
    sun.rotation_euler = Vector(LIGHTING["sun_direction"]).to_track_quat("-Z", "Y").to_euler()
    lc.objects.link(sun)

    fill_data = bpy.data.lights.new("fill_front", type="AREA")
    fill_data.energy = LIGHTING["fill_strength"]
    fill_data.color = hex_rgb(LIGHTING["fill_color"])
    fill_data.shape = "RECTANGLE"
    fill_data.size, fill_data.size_y = 5.0, 3.0
    fill = bpy.data.objects.new("fill_front", fill_data)
    fill.location = (2.4, -3.8, 2.8)
    fill.rotation_euler = (Vector((0, 0.4, 0.9)) - fill.location).to_track_quat("-Z", "Y").to_euler()
    lc.objects.link(fill)

    world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
    scene.world = world
    if bpy.app.version < (5, 0, 0):
        world.use_nodes = True
    nodes, links = world.node_tree.nodes, world.node_tree.links
    nodes.clear()
    ambient = nodes.new("ShaderNodeBackground")
    ambient.inputs["Color"].default_value = (*hex_rgb(LIGHTING["world_color"]), 1)
    ambient.inputs["Strength"].default_value = LIGHTING["world_strength"]
    backdrop = nodes.new("ShaderNodeBackground")
    backdrop.inputs["Color"].default_value = (*hex_rgb(LIGHTING["backdrop_color"]), 1)
    backdrop.inputs["Strength"].default_value = 1.7
    path = nodes.new("ShaderNodeLightPath")
    mix = nodes.new("ShaderNodeMixShader")
    out = nodes.new("ShaderNodeOutputWorld")
    links.new(path.outputs["Is Camera Ray"], mix.inputs["Fac"])
    links.new(ambient.outputs["Background"], mix.inputs[1])
    links.new(backdrop.outputs["Background"], mix.inputs[2])
    links.new(mix.outputs["Shader"], out.inputs["Surface"])

    cc = collection("Camera")
    cam_data = bpy.data.cameras.new("camera_three_quarter")
    cam_data.lens = 50
    cam = bpy.data.objects.new("camera_three_quarter", cam_data)
    cam.location = (5.5, -6.4, 4.1)
    target = Vector((0.0, 0.1, 0.82))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    cc.objects.link(cam)
    scene.camera = cam

    for engine in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
        try:
            scene.render.engine = engine
            break
        except TypeError:
            continue
    ee = scene.eevee
    for attr, val in (("taa_render_samples", 64), ("use_raytracing", True), ("use_shadows", True)):
        if hasattr(ee, attr):
            setattr(ee, attr, val)
    scene.render.resolution_x, scene.render.resolution_y = 1600, 1200
    scene.render.film_transparent = False
    try:
        scene.view_settings.view_transform = "AgX"
        scene.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        scene.view_settings.view_transform = "Filmic"


# ---------------------------------------------------------------------------
# Build / save / export / render
# ---------------------------------------------------------------------------

EXPORT_COLLECTIONS = ("Room_Shell", "Furniture", "Books", "Wall_Art", "Plants", "Toys")


def build_scene():
    clear_scene()
    MATERIALS.clear()
    build_shell()
    furn = collection("Furniture")
    build_rug(furn)
    build_table(furn)
    build_chair(furn)
    build_cushion(furn)
    shelf, shelf_h = build_bookshelf(furn, collection("Books"))
    build_frames()
    build_plant(collection("Plants"), shelf, shelf_h)
    build_toys(collection("Toys"), shelf, shelf_h)
    build_lighting_and_camera()


def report_stats():
    tris = 0
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.data.calc_loop_triangles()
            tris += len(obj.data.loop_triangles)
    meshes = sum(1 for o in bpy.context.scene.objects if o.type == "MESH")
    print(f"[3d-room] {meshes} mesh objects, {tris} triangles, {len(bpy.data.materials)} materials")


def export_glb():
    os.makedirs(os.path.dirname(GLB_PATH), exist_ok=True)
    for obj in bpy.context.scene.objects:
        obj.select_set(any(c.name in EXPORT_COLLECTIONS for c in obj.users_collection))
    bpy.ops.export_scene.gltf(
        filepath=GLB_PATH,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_lights=False,
        export_cameras=False,
        export_materials="EXPORT",
    )
    print(f"[3d-room] exported {GLB_PATH} ({os.path.getsize(GLB_PATH) / 1024:.0f} KB)")


def save_blend():
    os.makedirs(OUT_DIR, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    print(f"[3d-room] saved {BLEND_PATH}")


def render_preview():
    os.makedirs(OUT_DIR, exist_ok=True)
    bpy.context.scene.render.filepath = RENDER_PATH
    bpy.ops.render.render(write_still=True)
    print(f"[3d-room] rendered {RENDER_PATH}")


def main():
    args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    do_all = "--all" in args
    build_scene()
    report_stats()
    if do_all or "--save" in args:
        save_blend()
    if do_all or "--export" in args:
        export_glb()
    if do_all or "--render" in args:
        render_preview()


if __name__ == "__main__":
    main()
