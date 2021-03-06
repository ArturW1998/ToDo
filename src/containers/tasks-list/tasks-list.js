import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { priorityList } from '~/constants/constants';

import Helpers from '~/helpers/Helpers';

import { changeTaskText, updateUser } from '~/actions/actionCreators';

import ProgressBar from '~/components/progress-bar/progress-bar';
import Button from '~/components/button/button';
import ButtonsGroup from '~/components/buttons-group/buttons-group';
import InputField from '~/components/input-field/input-field';
import Filter from '~/components/filter/filter';
import Task from '~/components/task-item/task-item';

class TasksList extends Component {
  static propTypes = {
    activeCategory: PropTypes.string,
    addTask: PropTypes.func,
    alias: PropTypes.string,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string,
        id: PropTypes.number,
        text: PropTypes.string,
        alias: PropTypes.string
      })
    ),
    changeTaskText: PropTypes.func,
    deleteTask: PropTypes.func,
    doneTask: PropTypes.func,
    taskText: PropTypes.string,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string,
        id: PropTypes.number,
        category: PropTypes.string,
        text: PropTypes.string,
        priority: PropTypes.number,
        isTaskDone: PropTypes.bool
      })
    ),
    updateUser: PropTypes.func,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['ADD_USER']),
        id: PropTypes.number,
        avatar: PropTypes.string,
        name: PropTypes.string,
        alias: PropTypes.string,
        settings: PropTypes.arrayOf(
          PropTypes.shape({
            activeView: PropTypes.number,
            showDone: PropTypes.bool
          })
        )
      })
    )
  };

  static defaultProps = {
    activeCategory: 'default',
    addTask: () => {},
    alias: '',
    categories: [],
    changeTaskText: () => {},
    deleteTask: () => {},
    doneTask: () => {},
    taskText: '',
    tasks: [],
    updateUser: () => {},
    users: []
  };

  Helpers = new Helpers();

  state = {
    inputRate: 3
  };

  updateRateValue = ({ target }) => {
    const inputRate = +target.getAttribute('data-value');

    this.setState({ inputRate });
  };

  updateInputValue = ({ target: { value } }) => {
    const { changeTaskText } = this.props;

    changeTaskText(value);
  };

  sortTasksOrder = tasksArray => {
    tasksArray.sort((a, b) => a.priority - b.priority);

    const notDoneTasksArray = tasksArray.filter(({ isTaskDone }) => !isTaskDone);
    const doneTasksArray = tasksArray.filter(({ isTaskDone }) => isTaskDone);

    return [...notDoneTasksArray, ...doneTasksArray];
  };

  render() {
    let {
      users,
      addTask,
      taskText,
      activeCategory,
      categories,
      tasks,
      alias,
      doneTask,
      deleteTask,
      updateUser
    } = this.props;
    const { inputRate } = this.state;
    const { getDataByAlias } = this.Helpers;

    let categoryName = categories.filter(({ alias }) => alias === activeCategory);

    categoryName = categoryName.length ? categoryName[0].text : '';

    const data = getDataByAlias(users, alias);
    const {
      settings: [{ activeView }, { showDone }]
    } = data;

    const filteredTasks = tasks.filter(({ userId }) => userId === alias);
    tasks = this.sortTasksOrder(filteredTasks);

    const tasksList = tasks.map(({ priority, category, isTaskDone, id, text }, index) => {
      const conditionWithShowingDone =
        (priority === activeView && category === activeCategory) ||
        (activeView === 4 && category === activeCategory);
      const conditionWithoutShowingDone =
        (priority === activeView && !isTaskDone && category === activeCategory) ||
        (activeView === 4 && !isTaskDone && category === activeCategory);

      const isDone = showDone ? conditionWithShowingDone : conditionWithoutShowingDone;

      return isDone ? (
        <Task
          key={index}
          index={index}
          id={id}
          text={text}
          isTaskDone={isTaskDone}
          priority={priority}
          alias={alias}
          doneTask={doneTask}
          deleteTask={deleteTask}
        />
      ) : null;
    });

    return (
      <div>
        <div className="panel panel-default add-panel">
          <div className="panel-heading tasks-panel">
            <div className="row">
              <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 text-left text-block">
                <h4 className="title">
                  <i className="material-icons">list</i>
                  <span>{`${categoryName} tasks:`}</span>
                </h4>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right text-block">
                <InputField
                  value={taskText}
                  changeFunction={this.updateInputValue}
                  data={this.state}
                  addFunction={addTask}
                  placeholder="Click to add new task..."
                  maxLength={30}
                />
              </div>
            </div>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-lg-5 text-left">
                <ButtonsGroup specialClass="priority" activeElem={inputRate}>
                  {priorityList.map(({ title, id }, index) => (
                    <Button
                      key={id}
                      onClickFunction={this.updateRateValue}
                      dataValue={`${index + 1}`}
                      specialClass={`btn alert-${id}`}
                      checkActive={inputRate}
                    >
                      {title}
                    </Button>
                  ))}
                </ButtonsGroup>
              </div>
            </div>
          </div>
        </div>
        <ProgressBar alias={alias} tasksList={tasks} activeCategory={activeCategory} />
        <div className="panel panel-body tasks-list">{tasksList}</div>
        <Filter
          alias={alias}
          tasks={tasks}
          users={users}
          activeCategory={activeCategory}
          updateUser={updateUser}
        />
      </div>
    );
  }
}

export default connect(
  ({ activeCategory, categories, taskText, tasks, users }) => ({
    activeCategory,
    categories,
    taskText,
    tasks,
    users
  }),
  { changeTaskText, updateUser }
)(TasksList);
