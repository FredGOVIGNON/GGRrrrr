<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Vote
 *
 * @ORM\Table(name="vote")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\VoteRepository")
 */
class Vote
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Challenge")
     * @ORM\JoinColumn(name="challenge_id", referencedColumnName="id")
     */
    private $challengeId;

    /**
     * @var integer
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User")
     * @ORM\JoinColumn(name="gamer_id", referencedColumnName="id")
     */
    private $userId;

    /**
     * @var float
     *
     * @ORM\Column(name="vote", type="float")
     */
    private $vote;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set challengeId
     *
     * @param integer $challengeId
     * @return Vote
     */
    public function setChallengeId($challengeId)
    {
        $this->challengeId = $challengeId;

        return $this;
    }

    /**
     * Get challengeId
     *
     * @return integer 
     */
    public function getChallengeId()
    {
        return $this->challengeId;
    }

    /**
     * Set userId
     *
     * @param integer $userId
     * @return Vote
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;

        return $this;
    }

    /**
     * Get userId
     *
     * @return integer 
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * Set vote
     *
     * @param float $vote
     * @return Vote
     */
    public function setVote($vote)
    {
        $this->vote = $vote;

        return $this;
    }

    /**
     * Get vote
     *
     * @return float 
     */
    public function getVote()
    {
        return $this->vote;
    }
}
