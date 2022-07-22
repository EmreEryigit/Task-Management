import React, { useEffect, useState } from "react";
import { Container, Col, Button, Card, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Task from "./Task";
import AddTaskModal from "./AddTaskModal";
import { Droppable } from "react-beautiful-dnd";
interface BoardSectionProps {
    title: string;
    tasks: Task[];
}

const BoardSection = ({ title, tasks }: BoardSectionProps) => {
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => {
        setShowModal(false);
    };
    const handleShow = () => {
        setShowModal(true);
    };


    // Workaround for react18 and beautiful-dnd bug 
    const [ enabled, setEnabled ] = useState(false);

    useEffect(() => {
      const animation = requestAnimationFrame(() => setEnabled(true));
  
      return () => {
         cancelAnimationFrame(animation);
         setEnabled(false);
      };
    }, []);
  
    if (!enabled) {
        return null;
    }
    return (
        <>
            <Col className="d-flex flex-column p-2" md={3}>
                <div className="board-section-header d-flex flex-row align-items-center">
                    <h3 className="me-auto">{title}</h3>
                    <FontAwesomeIcon
                        icon={faPlus}
                        style={{ color: "#6f7782" }}
                    />
                </div>
                <Droppable droppableId={title}>
                    {(provided) => (
                        <Container className="p-0 d-flex flex-column h-100"
                            ref={provided.innerRef}
                            {...provided.droppableProps}>
                            {tasks.map((task: Task, i: number) => (
                                <Task
                                    key={task.id}
                                    task={task}
                                    boardCategory={title}
                                    index={i}
                                />
                            ))}
                            {tasks.length > 0 && (
                                <Button
                                    className="add-wrapper"
                                    onClick={handleShow}
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        style={{ padding: "2px" }}
                                    />
                                    Add Task
                                </Button>
                            )}
                            {tasks.length === 0 && (
                                <div className="is-empty d-flex flex-column">
                                    <Button
                                        className="add-wrapper"
                                        onClick={handleShow}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            style={{ padding: "2px" }}
                                        />
                                        Add Task
                                    </Button>
                                </div>
                            )}
                            {provided.placeholder}
                        </Container>
                    )}
                </Droppable>
            </Col>
            <AddTaskModal
                boardCategory={title}
                showModal={showModal}
                handleClose={handleClose}
            />
        </>
    );
};

export default BoardSection;
