import React from 'react';
import AddCourseStaffTable from "main/components/Courses/AddCourseStaffTable"; // Updated import
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { addCourseStaffFixtures } from 'fixtures/addCourseStaffFixtures';
import { rest } from "msw";

export default {
    title: 'components/Courses/AddCourseStaffTable', 
    component: AddCourseStaffTable 
};

const Template = (args) => {
    return (
        <AddCourseStaffTable {...args} /> 
    )
};

export const Empty = Template.bind({});

Empty.args = {
    courses: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    courseStaff: addCourseStaffFixtures.threeCourseStaff,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    courseStaff: addCourseStaffFixtures.threeCourseStaff,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/staff', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};
