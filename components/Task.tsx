import React, { ChangeEvent, FormEvent, useState } from "react";
import { Col, Button, Card, Form, Container, Modal } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Draggable } from "react-beautiful-dnd";
const UpdateTaskMutation = gql`
    mutation UpdateTask(
        $id: String!
        $title: String!
        $description: String!
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

const DeleteTaskMutation = gql`
    mutation DeleteTaskMutation($id: String!) {
        deleteTask(id: $id) {
            id
        }
    }
`;

const Task = ({
    task,
    boardCategory,
    index,
}: {
    task: Task;
    boardCategory: string;
    index: number;
}) => {
    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskDescription, setTaskDescription] = useState(task.description);
    const [assignTo, setAssignTo] = useState("");
    const [updateTask, { data, loading, error }] =
        useMutation(UpdateTaskMutation);
    const [deleteTask] = useMutation(DeleteTaskMutation);
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => {
        setShowModal(false);
    };
    const handleShow = () => {
        setShowModal(true);
    };
    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();
        updateTask({
            variables: {
                title: taskTitle,
                description: taskDescription,
                id: task.id,
                status: boardCategory,
            },
        });
        handleClose();
    };

    const handleTaskDelete = () => {
        deleteTask({
            variables: {
                id: task.id,
            },
        });
        handleClose();
    };
    return (
        <>
            <Draggable draggableId={task.id} index={index}>
                {(provided) => (
                    <Card
                        className="task-container"
                        onClick={() => handleShow()}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <Card.Body>{task.title}</Card.Body>
                    </Card>
                )}
            </Draggable>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update a Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={taskTitle}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setTaskTitle(e.target.value)
                                }
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={taskDescription}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setTaskDescription(e.target.value)
                                }
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Assign to</Form.Label>
                            <Form.Control
                                type="text"
                                value={assignTo}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setAssignTo(e.target.value)
                                }
                            ></Form.Control>
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                style={{ padding: "2px" }}
                                size="lg"
                                onClick={handleTaskDelete}
                            />
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Task;
