const CUBE_RADIUS = 0.23;
const CUBE_DIAMETER = CUBE_RADIUS * 2;

export function createCubeBodies(count, width = 8, height = 4) {
  const aspect = width / Math.max(height, 1);
  const columns = Math.min(count, Math.ceil(Math.sqrt(count * aspect)));
  const rows = Math.ceil(count / columns);
  const halfWidth = Math.max(CUBE_RADIUS + 0.5, width / 2 - CUBE_RADIUS);
  const halfHeight = Math.max(CUBE_RADIUS + 0.5, height / 2 - CUBE_RADIUS);
  const cellWidth = (halfWidth * 2) / columns;
  const cellHeight = (halfHeight * 2) / rows;
  return Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      position: [
        -halfWidth + (column + 0.5) * cellWidth,
        halfHeight - (row + 0.5) * cellHeight,
        ((index % 3) - 1) * 0.2,
      ],
      velocity: [
        Math.sin(index * 12.9898) * 0.55,
        Math.cos(index * 7.233) * 0.45,
        Math.sin(index * 3.117) * 0.2,
      ],
      colorVariant:
        Math.abs(Math.sin((index + 1) * 78.233) * 43758.5453) % 1 < 0.5
          ? 0
          : 1,
      rotation: [index * 0.21, index * 0.34, 0],
      pointer: null,
      hovered: false,
      mesh: null,
    };
  });
}

export function bounceCubeFromPointer(body, pointer) {
  let dx = body.position[0] - pointer[0];
  let dy = body.position[1] - pointer[1];
  let dz = body.position[2] - pointer[2];
  let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (distance < 0.0001) {
    dx = 0;
    dy = 1;
    dz = 0;
    distance = 1;
  }

  const normal = [dx / distance, dy / distance, dz / distance];
  const inwardSpeed =
    body.velocity[0] * normal[0] +
    body.velocity[1] * normal[1] +
    body.velocity[2] * normal[2];
  if (inwardSpeed < 0) {
    const reflection = 1.8 * inwardSpeed;
    body.velocity[0] -= reflection * normal[0];
    body.velocity[1] -= reflection * normal[1];
    body.velocity[2] -= reflection * normal[2];
  }

  body.velocity[0] += normal[0] * 2.1;
  body.velocity[1] += normal[1] * 2.1;
  body.velocity[2] += normal[2] * 2.1;
}

function resolveWall(body, axis, min, max, restitution) {
  if (body.position[axis] < min) {
    body.position[axis] = min;
    if (body.velocity[axis] < 0) body.velocity[axis] *= -restitution;
  } else if (body.position[axis] > max) {
    body.position[axis] = max;
    if (body.velocity[axis] > 0) body.velocity[axis] *= -restitution;
  }
}

function resolveCollision(first, second) {
  let dx = second.position[0] - first.position[0];
  let dy = second.position[1] - first.position[1];
  let dz = second.position[2] - first.position[2];
  let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (distance >= CUBE_DIAMETER) return;

  if (distance < 0.0001) {
    dx = CUBE_DIAMETER;
    dy = 0;
    dz = 0;
    distance = CUBE_DIAMETER;
  }

  const nx = dx / distance;
  const ny = dy / distance;
  const nz = dz / distance;
  const overlap = CUBE_DIAMETER - distance;
  first.position[0] -= nx * overlap * 0.5;
  first.position[1] -= ny * overlap * 0.5;
  first.position[2] -= nz * overlap * 0.5;
  second.position[0] += nx * overlap * 0.5;
  second.position[1] += ny * overlap * 0.5;
  second.position[2] += nz * overlap * 0.5;

  const relativeSpeed =
    (second.velocity[0] - first.velocity[0]) * nx +
    (second.velocity[1] - first.velocity[1]) * ny +
    (second.velocity[2] - first.velocity[2]) * nz;
  if (relativeSpeed >= 0) return;

  const impulse = (-(1 + 0.97) * relativeSpeed) / 2;
  first.velocity[0] -= impulse * nx;
  first.velocity[1] -= impulse * ny;
  first.velocity[2] -= impulse * nz;
  second.velocity[0] += impulse * nx;
  second.velocity[1] += impulse * ny;
  second.velocity[2] += impulse * nz;
}

export function advanceCubeBodies(bodies, elapsed, width = 8, height = 4) {
  const delta = Math.min(elapsed, 1 / 30);
  const halfWidth = Math.max(CUBE_RADIUS + 0.5, width / 2 - CUBE_RADIUS);
  const halfHeight = Math.max(CUBE_RADIUS + 0.5, height / 2 - CUBE_RADIUS);

  for (const body of bodies) {
    if (body.hovered && body.pointer) {
      const dx = body.position[0] - body.pointer[0];
      const dy = body.position[1] - body.pointer[1];
      const dz = body.position[2] - body.pointer[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const force = Math.min(10, 5 / distance);
      body.velocity[0] += (dx / distance) * force * delta;
      body.velocity[1] += (dy / distance) * force * delta;
      body.velocity[2] += (dz / distance) * force * delta;
    }

    body.position[0] += body.velocity[0] * delta;
    body.position[1] += body.velocity[1] * delta;
    body.position[2] += body.velocity[2] * delta;

    const damping = Math.exp(-0.002 * delta);
    body.velocity[0] *= damping;
    body.velocity[1] *= damping;
    body.velocity[2] *= damping;

    resolveWall(body, 0, -halfWidth, halfWidth, 0.99);
    resolveWall(body, 1, -halfHeight, halfHeight, 0.99);
    resolveWall(body, 2, -1.4, 1.4, 0.99);
  }

  const cells = new Map();
  for (let index = 0; index < bodies.length; index += 1) {
    const [x, y, z] = bodies[index].position;
    const key = `${Math.floor(x / CUBE_DIAMETER)},${Math.floor(y / CUBE_DIAMETER)},${Math.floor(z / CUBE_DIAMETER)}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(index);
  }

  for (let first = 0; first < bodies.length; first += 1) {
    const [x, y, z] = bodies[first].position;
    const cellX = Math.floor(x / CUBE_DIAMETER);
    const cellY = Math.floor(y / CUBE_DIAMETER);
    const cellZ = Math.floor(z / CUBE_DIAMETER);
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetZ = -1; offsetZ <= 1; offsetZ += 1) {
          const nearby = cells.get(
            `${cellX + offsetX},${cellY + offsetY},${cellZ + offsetZ}`,
          );
          if (!nearby) continue;
          for (const second of nearby) {
            if (second > first) resolveCollision(bodies[first], bodies[second]);
          }
        }
      }
    }
  }

  for (const body of bodies) {
    if (!body.mesh) continue;
    body.mesh.position.set(...body.position);
    body.mesh.rotation.x += body.velocity[2] * delta;
    body.mesh.rotation.y += body.velocity[0] * delta;
  }
}
