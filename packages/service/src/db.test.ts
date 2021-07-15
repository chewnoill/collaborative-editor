import * as Y from 'yjs';

test("crdts can be persisted",()=>{
	// create a yjs document A
	const ydoc = new Y.Doc();
	// make a change to the document
	const ytext = ydoc.getText("codemirror");
	ytext.insert(0,"hello world");
	const state = Y.encodeStateAsUpdate(ydoc)

	// persist this change to the database
	// ????

	// get the change back from the database
	const stateFromDatabase = state
	
	// create yjs document B from database change
	const ydoc2 = new Y.Doc();
	Y.applyUpdate(ydoc2, stateFromDatabase);

	// expect that the contents of document A matches document B
	// test the result
	expect(ydoc.getText('codemirror').toJSON()).toBe(
		ydoc2.getText('codemirror').toJSON()
	)
});