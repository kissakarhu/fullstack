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


export default Course