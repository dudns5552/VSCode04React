function BoardRoutes(props) {

  return (<>
    <Route path='/Free/Write' element={<FreeWrite />} />
    <Route path='/Free/List' element={<FreeList />} >
      {/* <Route path=':page' element={<FreeList />} /> */}
    </Route>
    <Route path='/Free/view' >
      <Route path=':idx' element={<FreeView />} />
    </Route>
    <Route path='/Free/Edit' element={<FreeEdit />} />
  </>);
}
export default BoardRoutes;