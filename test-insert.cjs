const statements = [
  { id: '1', type: 'declare' },
  { id: '2', type: 'assign' },
  {
    id: '3',
    type: 'if',
    thenBranch: [
      { id: '4', type: 'output' }
    ],
    elseBranch: []
  }
];

const recursiveInsertBefore = (list, targetId, newBlock) => {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item.id === targetId) {
      list.splice(i, 0, newBlock);
      return true;
    }
    if (item.type === 'if') {
      if (recursiveInsertBefore(item.thenBranch, targetId, newBlock)) return true;
      if (recursiveInsertBefore(item.elseBranch, targetId, newBlock)) return true;
    } else if (item.type === 'while' || item.type === 'do' || item.type === 'for') {
      if (recursiveInsertBefore(item.body, targetId, newBlock)) return true;
    }
  }
  return false;
};

const copy = JSON.parse(JSON.stringify(statements));
const newBlock = { id: 'new_99', type: 'assign' };

console.log('Inserting before node 4 inside the IF then branch:');
const success = recursiveInsertBefore(copy, '4', newBlock);
console.log('Success:', success);
console.log('Modified structure:', JSON.stringify(copy, null, 2));
