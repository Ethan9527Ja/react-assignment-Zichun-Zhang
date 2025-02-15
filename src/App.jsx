import { use, useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//test
// const list = [
//   {id: 1, task: '去买菜', completed: 1},
//   {id: 2, task: '去游泳', completed: 1},
//   {id: 3, task: '去学习', completed: 1}
// ]
// 任务列表，组件的功能是根据列表渲染任务列表
function HandleTaskList({taskList, handleCompletePosition}) {
  return(
    <ul className="space-y-4 mt-4">
      {taskList.map(item => (
        <li key={item.id} className="flex items-center justify-between">
        <ConditionalRendering item = {item} />
        {item.completed !== 2 && (<button
          onClick={() => handleCompletePosition(item.id)}
          className="bg-gray-500 text-white font-medium text-xs py-2 px-3 rounded 
                     hover:bg-gray-600 hover:shadow 
                     active:bg-gray-700 active:scale-95 
                     transition duration-150 ease-in-out"
        >
          完成
        </button>)}
      </li>

      ))}
    </ul>
  )}
  // 此组件用来实现条件渲染 使用对象映射，如果后期增加状态，只需要在对象中增加即可
  function ConditionalRendering({item}) {
    const renderMap = {
      //通过对completed的映射判断，来实现渲染不同的结果
      1: <div className="font-semibold text-base">{item.task}</div>,
      2: <div className="font-semibold text-base text-red-300 line-through decoration-black">{item.task}</div>
    }
    return renderMap[item.completed]
  }
  // 添加任务
function AddDisplayTask ({setTaskList, taskList}) {
  const [text, setText] = useState('')
  return(
    <div className="flex items-center justify-center bg-gray-50">
      <div className="w-1/2 min-w-[350px] max-w-[600px] bg-gray-100 p-6 rounded-lg shadow-lg">
      <div className='flex items-center justify-center'>
        <textarea value = {text} id="addTask" placeholder='请输入要加入的任务' className="border border-gray-300 rounded p-2"
        onChange={(e) => setText(e.target.value)}//实现表单的绑定
        ></textarea>
        <div className="text-center w-1/6 ml-8">
            <button className="bg-blue-500 text-white font-medium text-xs py-2 px-3 rounded 
                              hover:bg-gray-600 hover:shadow 
                              active:bg-gray-700 active:scale-95 
                              transition duration-150 ease-in-out"
                              onClick = {() => 
                                {text !== '' && setTaskList([...taskList, {id: Date.now(), task: text, completed: 1}]);
                                setText('')
                              }}>
              添加任务
            </button>
          </div>
      </div>
      </div>
    </div> 
  )
}
// 组件功能为显示任务，包括任务列表和完成按钮
function DisplayTask ({taskList, handleCompletePosition, setTaskList}) {
  return (
  <div className="flex items-center justify-center bg-gray-50">
  <div className="w-1/2 min-w-[350px] max-w-[600px] bg-gray-100 p-6 rounded-lg shadow-lg">
    {/* 标题部分 */}
    <div className="flex items-center">
      <h2 className="text-2xl font-semibold mr-4">任务列表</h2>
      <ChangeTaskDisplay taskList = {taskList} setTaskList = {setTaskList}/>
    </div>
    {/* 任务列表部分 */}
    <HandleTaskList taskList={taskList} handleCompletePosition = {handleCompletePosition}/>
  </div>
</div>
  )}
//此组件实现切换任务的完成状态的一个筛选的功能
function ChangeTaskDisplay ({taskList, setTaskList}) {
  const [changeTask,setChangeTask] = useState([])
  const [isActive, setIsActive] = useState(false)
  //使用对象映射来实现筛选功能
  const handleCompleteTask = (completeState) => {
    setChangeTask(taskList)
    //申明一个新的状态，用来判断是否是已经完成的任务，规避usestate不重新渲染的问题
    const newState = !isActive
    setIsActive(newState)
    const click = {
      true: () => {
        setTaskList(taskList.filter((task) => task.completed !== completeState))
      },
      false: () => {
        setTaskList(changeTask)
      }
    }
    click[newState]()
  }
  return (
    <div>
      <button className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded hover:bg-gray-300 transition mr-4 "
              onClick={() => handleCompleteTask(2)}>未完成</button>
      <button className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded hover:bg-gray-300 active:bg-gray-400 transition"
              onClick={() => handleCompleteTask(1)}>已完成</button>
    </div>
    
  )
}


function App() {
  //使用useState来存储任务列表，并且利用localStorage来存储数据,进入网页会自动抓取localstorage里面的数据 
  const [taskList, setTaskList] = useState(() => {
    const list = localStorage.getItem('taskList')
    return list ? JSON.parse(list) : []
  }) 
  //test
  // useEffect(() => {
  //   setTaskList(list)
  // },[])
  //使用useeffect来进行数据的自动更新
  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }, [taskList]);
  //定义一个函数，用来处理任务的完成状态
  const handleCompletePosition = (id) => {
  setTaskList(taskList.map(item =>
    item.id === id ? { ...item, completed: 2 } : item
  ));
};
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50">
      <AddDisplayTask  setTaskList = {setTaskList} taskList = {taskList} />
      <DisplayTask taskList = {taskList} handleCompletePosition = {handleCompletePosition} setTaskList = {setTaskList}/>
    </div>
  )
}

export default App
