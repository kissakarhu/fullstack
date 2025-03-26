const Course = ({course}) => {
  return (
    <>
    <Header name={course.name} />
    <Content content={course.parts} />
    <Total parts={course.parts} />
    </>
  )
}

const Header = ({name}) => {
  return <h1>{name}</h1>
}

const Content = ({content}) => {
  return (
    content.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)
  )
}

const Total = ({parts}) => {
  const total = parts.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exercises, 0)
  
  return <p>total of {total} exercises</p>
}

const Part = ({name, exercises}) => {
  return <p>{name} {exercises}</p>
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App