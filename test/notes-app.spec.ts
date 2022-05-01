import {expect} from 'chai';
import 'mocha';
import {Notes} from '../src/ejercicio-3/notes';
import {Wrapper} from '../src/ejercicio-4/wrapper';
const Note1 = new Notes();
const wrapper = new Wrapper();
describe('Tests Notes Methods', () => {
  it('There must be a class Notes', () => {
    expect(Notes).to.exist;
  });
  it('deleteNote test1 must work because it exists', () => {
    expect(Note1.deleteNote('steph', 'test1')).to.equal(1);
  });
  it('deleteNote test1 must fail because it does not exists', () => {
    expect(Note1.deleteNote('steph', 'test1')).to.equal(0);
  });
  it('Create test1 must work', () => {
    expect(Note1.createNote('steph', 'test1', 'This is a test', 'red')).to.equal(1);
  });
  it('Create test4 green must work', () => {
    expect(Note1.createNote('usuarioPrueba', 'test4', 'This is a test', 'green')).to.equal(1);
  });
  it('Create test6 yellow must work', () => {
    expect(Note1.createNote('usuarioPrueba', 'test6', 'This is a test', 'yellow')).to.equal(1);
  });
  it('Create test8 blue must work', () => {
    expect(Note1.createNote('usuarioPrueba', 'test8', 'This is a test', 'blue')).to.equal(1);
  });
  it('Create test1 must fail because it already exists', () => {
    expect(Note1.createNote('steph', 'test1', 'This is a test', 'red')).to.equal(0);
  });
  it('Create test1 must fail because it already exists', () => {
    expect(Note1.createNote('steph', 'test1', 'This is a test', 'red')).to.equal(0);
  });
  it('Read Note exists', () => {
    expect(Note1.readNote('steph', 'test1')).to.exist;
  });
  it('Read test4 green must work', () => {
    expect(Note1.readNote('usuarioPrueba', 'test4')).to.equal(1);
  });
  it('Read test6 yellow must work', () => {
    expect(Note1.readNote('usuarioPrueba', 'test6')).to.equal(1);
  });
  it('Read test8 blue must work', () => {
    expect(Note1.readNote('usuarioPrueba', 'test8')).to.equal(1);
  });
  it('Read Note Red must work', () => {
    expect(Note1.readNote('steph', 'test1')).to.equal(1);
  });
  it('Read Note Red must fail because the note does not exists', () => {
    expect(Note1.readNote('steph', 'test3')).to.equal(0);
  });
  it('List Notes exists', () => {
    expect(Note1.listNotes('steph')).to.exist;
  });
  it('List Notes => steph must work', () => {
    expect(Note1.listNotes('steph')).to.equal(1);
  });
  it('List Notes => usertest must fail because the user has not created any notes', () => {
    expect(Note1.listNotes('usertest')).to.equal(0);
  });
  it('List Notes => usertest must fail because the user has deleted all its notes', () => {
    expect(Note1.listNotes('emptyUserTests')).to.equal(0);
  });
  it('EditNote test1 must work', () => {
    expect(Note1.editNote('steph', 'test1', 'Editing', 'yellow')).to.equal(1);
  });
  it('EditNote test99 must fail because it does not exists', () => {
    expect(Note1.editNote('steph', 'test99', 'Editing', 'yellow')).to.equal(0);
  });
  it('Must delete usuarioPrueba directory', () => {
    expect(wrapper.deleteFileAndDirectory('Notas/usuarioPrueba')).to.not.throw;
  });
});