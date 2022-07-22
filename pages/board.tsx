import { gql, useQuery, useMutation } from "@apollo/client";
import { Row } from "react-bootstrap";
import BoardSection from "../components/BoardSection";
import Task from "../components/Task";
import {  DragDropContext, DropResult } from "react-beautiful-dnd";
import { useState } from "react";


const AllTasksQuery = gql`
    query {
        tasks {
            id
            title
            description
            status
        }
    }
`;

const UpdateTaskMutation = gql`
    mutation UpdateTask(
        $id: String!
        $title: String
        $description: String
        $status: String!
        $userId: String
    ) {
        updateTask(
            id: $id
            title: $title
            description: $description
            status: $status
            userId: $userId
        ) {
            id
            title
            description
            status
        }
    }
`;

const Board = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const { data, loading, error } = useQuery(AllTasksQuery, {
        onCompleted: (data) => {
            console.log(data)
            setTasks(data.tasks);
        },
    });
    const [updateTask] = useMutation(UpdateTaskMutation)
    if (loading) return <p>Loading...</p>;
    if (error) return <p>error</p>;
    const sections: string[] = ["Backlog", "In-Progress", "Review", "Done"];

    const onDragEnd = (result: DropResult) => {
      const {destination, source, draggableId} = result
      if(!destination){
        return
      }
      if(destination.droppableId === source.droppableId) {
        return
      }
      updateTask({
        variables: {
          id: draggableId,
          status: destination.droppableId
        }
      })

      const updatedTasks = tasks && tasks.map((task) => {
        if(task.id === draggableId) {
            return {
                ...task,
                status: destination.droppableId
            }
        } else {
            return task
        }
      })
      setTasks(updatedTasks)
    }

    return (
        <div className="pt-3 h-100 d-flex flex-column">
            <Row>
                <h1>Project Title</h1>
            </Row>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="board-container d-flex flex-row flex-grow-1">
                    {sections.map((section, i) => {
                        let filteredData: Task[] = data
                            ? data.tasks.filter(
                                  (task: Task) => task.status === section
                              )
                            : [];
                        return (
                            <BoardSection
                                title={section}
                                key={i}
                                tasks={filteredData}
                            />
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Board;
